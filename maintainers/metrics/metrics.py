#!/usr/bin/env python

import pandas as pd
import argparse
import os
from datetime import datetime
from enum import Enum, auto


def valid_path(path):
    if not os.path.exists(path):
        raise argparse.ArgumentTypeError(f"The file '{path}' does not exist.")
    return path


def valid_date(date_string):
    try:
        # Try to parse the date string into a datetime object
        return datetime.fromisoformat(date_string)
    except ValueError:
        raise argparse.ArgumentTypeError(f"'{date_string}' must be an ISO 8601 date.")


class Interval(Enum):
    day = auto()
    week = auto()
    month = auto()
    quarter = auto()


def valid_interval(interval):
    try:
        return Interval[interval.lower()]
    except KeyError:
        raise argparse.ArgumentTypeError(
          f"'{interval}' is not a valid interval."
          f"Valid values:\n{[str(e) + ', ' for e in Interval]}."
        )


def main():
    parser = argparse.ArgumentParser(description="View metrics on GitHub activities")
    parser.add_argument("issues", type=valid_path, help="Path to a JSON file with all issues. Must contain at least the fields: author,labels,state,closedAt,createdAt")
    parser.add_argument("pulls", type=valid_path, help="Path to a JSON file with all pull requests. Must contain at least the fields: author,labels,state,createdAt,mergedAt,closedAt")
    parser.add_argument('-f', '--from', type=valid_date)
    parser.add_argument('-t', '--to', nargs='?', type=valid_date, default=datetime.today().date())
    parser.add_argument('-i', '--interval', nargs='?', type=valid_date, default=Interval.month, help=f'The time interval ({", ".join([str(e) for e in Interval])}). Default is monthly.')
    parser.add_argument('-l', '--labels', nargs='*', type=str)

    args = parser.parse_args()

    issues = pd.read_json(args.issues)
    pulls = pd.read_json(args.pulls)

    # add a new column so it's easier to access
    pulls["author_login"] = pulls["author"].apply(lambda x: x['login'])
    # overwrite string dates with the parsed values
    pulls.loc[:, 'mergedAt'] = pd.to_datetime(pulls['mergedAt'])
    pulls.loc[:, 'createdAt'] = pd.to_datetime(pulls['createdAt'])
    pulls.loc[:, 'closedAt'] = pd.to_datetime(pulls['closedAt'])

    merged = pulls.dropna(subset=['mergedAt'])
    first_merge = merged.groupby('author_login')['mergedAt'].min().reset_index()
    # TODO: actual metrics along the lines of https://www.tweag.io/blog/2024-05-02-right-words-right-place/
    print(first_merge.sort_values(by="mergedAt"))

if __name__ == '__main__':
    main()

