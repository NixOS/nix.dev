from setuptools import setup

setup(
    name='metrics',
    py_modules=['metrics'],
    entry_points={
        'console_scripts': [
            'metrics = metrics:main',
        ],
    },
)
