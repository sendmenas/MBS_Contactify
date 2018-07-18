# Contactify

Before starting to work you need to download the data, use "Force sync" in the footer for that.

## Header
- Header tabs are clickable, but the main content does not change based on the selected tab;
- User account is clickable. If clicked, user account action menu is toggled.

## Filter
- Name filter allows only letters and white space;
- City filter toggles cities dropdown. Cities are collected during sync, so no dropdown will be displayed if not synced;
- If "Show active" is not selected, active and inactive items are displayed after filtering. If selected, only active users are filtered;
- Filter button will filter items based on filter fields;
- Reset filter button will reset filter fields and sorting;
- If "Add new contract" button is pressed, create/edit dialog is displayed. All fields must be filled in order to submit the form. No data validation applied. You will not be able to save the contract if data is not synced.

## Data table
- Name column sorting has two directions - ascending and descending. Direction changes by pressing the sorting arrow. Initially sorting is not set. Pressing this arrow removes sorting direction from surname;
- Surname column sorting has two directions - ascending and descending. Direction changes by pressing the sorting arrow. Initially sorting is not set. Pressing this arrow removes sorting direction from surname;
- When the item is pressed, contract data is displayed in the left side box;
- If "pencil" icon is pressed, contract create/edit dialog is displayed with profile data. All fields must be filled in order to submit the form. No data validation applied;
- If "trash" icon is pressed, an item is removed. Items are removed only locally, the file stays intact. After data sync all items will be loaded again;

## Footer
- "Force sync" will get the data from contacts.json and fill the table with items and resets the filter and sorting.
