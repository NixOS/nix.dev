# Migrating Documentation

Migrating documentation is often crucial when reorganizing any project. As such, below is a list of instructions and guidelines to aid you when embarking on the migration journey.

## Licensing
   1. Familiarize yourself with the licenses governing the documentation you intend to migrate.
   2. Verify that the license of the documentation is compatible with this project's current license.
   3. If the licenses align, proceed with the migration. Otherwise, follow the steps 4 thourgh 7.
   4. Identify the file and determine all contributors to the documentation (typically using blame or a co-owners document).
   5. Contact all contributors, requesting permission to migrate the document to the new license.
   6. Await responses from all recipients and obtain explicit approval from each contributor before proceeding.
   7. If agreement from all contributors cannot be obtained, consider alternative solutions to avoid licensing conflicts, such as:
        - A full rewrite of the document.
        - Rewriting the areas of specific contributors who did not reply or approve.

## Documentation Assessment
   1. Perform a thorough review of the existing documentation.
   2. Assess the scope, relevance, and quality of the documentation in relation to the migration location.
   3. Consider factors such as:
      - Completeness
      - Accuracy
      - Organization
      - Readability
   4. Be sure to identify the type of document that it is easily classifiable as one of the following:
      - Reference 
      - Concept
      - Tutorial
      - Recipe 
   5. If it does not properly classify under step 4 then one will need to consider the following options:
      - Rewrite the document to conform
      - Split it up into multiple documents
      - Abondoning the work entirely if it's not feasible 

## Version Control and Branching Strategy
   Determine the appropriate branch in the repository that contains the most up-to-date or relevant information about the project. In some situations, one often assumes the latest branch is often main or master. Yet in contrast, it can be located in other branches such as beta, next, etc. 

## Visual Quality Assurance
   1. Please make sure the table of contents is structured correctly on the actual site and navigate as expected.
   2. Check the following aspects to function or render as intended:
      - Headings
      - Sections
      - Code Formatting
      - Tables
      - links
      - Images and Diagrams