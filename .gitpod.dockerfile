FROM gitpod/workspace-full:latest

# 0. Switch to root
USER root

# 1. Install direnv & git-lfs
RUN apt-get install direnv \
                    git-lfs

# 2. Install Nix
RUN addgroup --system nixbld \
  && usermod -a -G nixbld gitpod \
  && mkdir -m 0755 /nix && chown gitpod /nix \
  && mkdir -p /etc/nix && echo 'sandbox = false' > /etc/nix/nix.conf

CMD /bin/bash -l
USER gitpod
ENV USER gitpod
WORKDIR /home/gitpod

RUN touch .bash_profile && \
  curl https://nixos.org/nix/install | sh

RUN mkdir -p /home/gitpod/.config/nixpkgs && echo '{ allowUnfree = true; }' >> /home/gitpod/.config/nixpkgs/config.nix

RUN echo '. /home/gitpod/.nix-profile/etc/profile.d/nix.sh' >> /home/gitpod/.bashrc
RUN echo 'eval "$(direnv hook bash)"' >> /home/gitpod/.bashrc

# n. Give back control
USER root
