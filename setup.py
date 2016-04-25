# -*- coding: utf-8 -*-

import os

from setuptools import setup
from setuptools import find_packages


def read(rnames):
    name = os.path.join(os.path.dirname(__file__), rnames)
    with open(name, 'r') as f:
        return f.read()

install_requires = [ "Sphinx", "sphinx_rtd_theme" ]

setup(name='nix-cookbook',
      version_format='{tag}.{commitcount}+{gitsha}',
      description='',
      long_description=read('README.rst'),
      classifiers=[
          "Programming Language :: Python",
          "Programming Language :: Python :: Implementation :: CPython",
          "Programming Language :: Python :: Implementation :: PyPy",
          "Programming Language :: Python :: 3.4",
          "Programming Language :: Python :: 3.5",
      ],
      author='Domen Kozar',
      license='BSD',
      packages=find_packages(),
      install_requires=install_requires,
      setup_requires=[
          'setuptools-git >= 0',
          'setuptools-git-version',
      ],
      entry_points="""
      """,
      include_package_data=True,
      zip_safe=False,
      )
