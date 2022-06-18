zip wmonline-backend.zip -r config *.js package.json presets externalResources style-templates
scp wmonline-backend.zip sambag@sambag.uber.space:
ssh sambag@sambag.uber.space "sh deploy_werckmeister_backend.sh"
rm wmonline-backend.zip