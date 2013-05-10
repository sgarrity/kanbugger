kanbugger
=========

A Firefox Add-on for importing Bugzilla bugs as Kanbanery cards.

If you have the [Add-on SDK](https://github.com/mozilla/addon-sdk)
installed, you can test the add-on with:

`cfx run`

while you're in the add-on dir. There are also tests that can be run:

`cfx test`

You can pass arbitrary config to your local install at the command line by copying and editing config_local.json: 

`cp data/config_local.example data/config_local.json`

Note that local settings will overwrite defaults. 
