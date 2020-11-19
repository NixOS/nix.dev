.. _deploying-nixos-using-terraform:

Deploying NixOS using Terraform
===============================

Assuming you're `familiar with the basics of Terraform <https://www.terraform.io/intro/index.html>`_,
by the end of tutorial you will have provisioned Amazon AWS instance with Terraform
and use Nix to deploy incremental changes to NixOS running on the instance. 

We'll look at how to boot a NixOS machine and how to deploy the incremental changes:


Booting NixOS image
-------------------

1. Start by providing terraform executable:

.. code:: shell

   nix-shell -p terraform

2. We are using `Terraform Cloud <https://app.terraform.io>`_ as a `state/locking backend <https://www.terraform.io/docs/state/purpose.html>`_:

.. code:: shell

   terraform login

3. Make sure to `create an organization <https://app.terraform.io/app/organizations/new>`_ like ``myorganization`` in your Terraform Cloud account.

4. Inside ``myorganization`` `create a workspace <https://app.terraform.io/app/cachix/workspaces/new>`_ by chosing 
"CLI-driven workflow and pick name like  ``myapp``.

4. Inside a new directory create ``main.tf`` file with the following contents that will start an AWS instance with NixOS image using one SSH keypair and an SSH security group:

.. code:: 

    terraform {
        backend "remote" {
            organization = "myorganization"

            workspaces {
                name = "myapp"
            }
        }
    }

    provider "aws" {
        region = "eu-central-1"
    }

    module "nixos_image" {
        source  = "git::https://github.com/tweag/terraform-nixos.git//aws_image_nixos?ref=5f5a0408b299874d6a29d1271e9bffeee4c9ca71"
        release = "20.09"
    }

    resource "aws_security_group" "ssh_and_egress" {
        ingress {
            from_port   = 22
            to_port     = 22
            protocol    = "tcp"
            cidr_blocks = [ "0.0.0.0/0" ]
        }

        egress {
            from_port       = 0
            to_port         = 0
            protocol        = "-1"
            cidr_blocks     = ["0.0.0.0/0"]
        }
    }

    resource "tls_private_key" "state_ssh_key" {
        algorithm = "RSA"
    }

    resource "local_file" "machine_ssh_key" {
        sensitive_content = tls_private_key.state_ssh_key.private_key_pem
        filename          = "${path.module}/id_rsa.pem"
        file_permission   = "0600"
    }

    resource "aws_key_pair" "generated_key" {
        key_name   = "generated-key-${sha256(tls_private_key.state_ssh_key.public_key_openssh)}"
        public_key = tls_private_key.state_ssh_key.public_key_openssh
    }

    resource "aws_instance" "machine" {
        ami             = module.nixos_image.ami
        instance_type   = "t3.micro"
        security_groups = [ aws_security_group.ssh_and_egress.name ]
        key_name        = aws_key_pair.generated_key.key_name
        
        root_block_device {
            volume_size = 50 # GiB
        }
    }

    output "public_dns" {
        value = aws_instance.machine.public_dns
    }

The only NixOS specific snippet is:

.. code:: 

   module "nixos_image" {
     source = "git::https://github.com/tweag/terraform-nixos.git/aws_image_nixos?ref=5f5a0408b299874d6a29d1271e9bffeee4c9ca71"
     release = "20.09"
   }

.. note::

   ``aws_image_nixos`` module will return an NixOS AMI given `NixOS release number <https://status.nixos.org>`_
   so that ``aws_instance`` resource can reference the AMI in `instance_type <https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#instance_type>`_ argument.

5. Make sure to `configure AWS credentials <https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication>`_.

6. Applying Terraform configuration should get you a running NixOS:

.. code:: shell

   terraform init
   terraform apply


Deploying NixOS changes
-----------------------

Once AWS instance is running an NixOS image via Terraform, we can teach Terraform to always build
latest NixOS configuration and apply those changes to your instance.

1. Create ``configuration.nix`` with the following contents:

.. code:: nix 

    { config, lib, pkgs, ... }: {
      imports = [ <nixpkgs/nixos/modules/virtualisation/amazon-image.nix> ];

      # Open https://search.nixos.org/options for all options
    }

2. Append the following snippet to your ``main.tf``:

.. code:: 

    module "deploy_nixos" {
        source = "git::https://github.com/tweag/terraform-nixos.git//deploy_nixos?ref=5f5a0408b299874d6a29d1271e9bffeee4c9ca71"
        nixos_config = "${path.module}/configuration.nix"
        target_host = aws_instance.machine.public_ip
        ssh_private_key_file = local_file.machine_ssh_key.filename
        ssh_agent = false
    }

3. Deploy:

.. code:: shell

   terraform init
   terraform apply


Caveats
-------

- ``deploy_nixos`` module requires NixOS to be installed on the target machine and Nix on the host machine.

- ``deploy_nixos`` module doesn't work when the client and target architectures are different (unless you use `distributed builds <https://nixos.org/manual/nix/unstable/advanced-topics/distributed-builds.html>`_).

- If you need to inject a value into Nix, there is no elegant solution.

- Each machine is evaluated separately, so note that your memory requirements will grow linearly with the number of machine.


Going Forward
-------------

- It's possible to `switch to use Google Compute Engine provider <https://github.com/tweag/terraform-nixos/tree/master/google_image_nixos#readme>`_.

- `deploy_nixos module <https://github.com/tweag/terraform-nixos/tree/master/deploy_nixos#readme>`_ supports a number arguments, for example to upload keys, etc.
