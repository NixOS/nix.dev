# Translation workflow

This folder contains code and translations for supporting multiple languages with Sphinx.
See [the Sphinx internationalization documentation](https://www.sphinx-doc.org/en/master/usage/configuration.html) for more details.

## Structure of translation files

### Translation source files

The source files for our translations are hand-edited, and contain the raw mapping of words onto various languages.
They are checked in to `git` history with this repository.

`src/sphinx_book_theme/assets/translations/jsons` contains a collection of JSON files that define the translation for various phrases in this repository.
Each file is a different phrase, and its contents define language codes and translated phrases for each language we support.
They were originally created with [the smodin.io language translator](https://smodin.me/translate-one-text-into-multiple-languages) (see below for how to update them).

### Compiled translation files

The translation source files are compiled at build time (when we run `stb compile`) automatically.
This is executed by the Python script at `python src/sphinx_book_theme/_compile_translations.py` (more information on that below).

These compiled files are **not checked into `.git` history**, but they **are** bundled with the theme when it is distributed in a package.
Here's a brief explanation of each:

- `src/sphinx_book_theme/theme/sphinx_book_theme/static/locales` contains Sphinx locale files that were auto-converted from the files in `jsons/` by the helper script below.
- `src/sphinx_book_theme/_compile_translations.py` is a helper script to auto-generate Sphinx locale files from the JSONs in `jsons/`.

## Workflow of translations

Here's a short workflow of how to add a new translation, assuming that you are translating using the [smodin.io service](https://smodin.io/translate-one-text-into-multiple-languages).

1. Go to [the smodin.io service](https://smodin.io/translate-one-text-into-multiple-languages)
2. Select as many languages as you like.
3. Type in the phrase you'd like to translate.
4. Click `TRANSLATE` and then `Download JSON`.
5. This will download a JSON file with a bunch of `language-code: translated-phrase` mappings.
6. Put this JSON in the `jsons/` folder, and rename it to be the phrase you've translated in English.
   So if the original phrase is `My phrase`, you should name the file `My phrase.json`.
7. Run [the `prettier` formatter](https://prettier.io/) on this JSON to split it into multiple lines (this makes it easier to read and edit if translations should be updated)

   ```bash
   prettier sphinx_book_theme/translations/jsons/<message name>.json
   ```

8. Run `python src/sphinx_book_theme/_compile_translations.py`
9. This will generate the locale files (`.mo`) that Sphinx uses in its translation machinery, and put them in `locales/<language-code>/LC_MESSAGES/<msg>.mo`.

Sphinx should now know how to translate this message!

## To update a translation

To update a translation, you may go to the phase you'd like to modify in `jsons/`, then find the entry for the language you'd like to update, and change its value.
Finally, run `python src/sphinx_book_theme/_compile_translations.py` and this will update the `.mo` files.
