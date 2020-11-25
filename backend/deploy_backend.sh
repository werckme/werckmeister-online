zip wmonline-backend.zip -r config index.js localWorkspaceBuilder.js package.json presets
scp wmonline-backend.zip sambag@sambag.uber.space:
ssh sambag@sambag.uber.space "sh deploy_werckmeister_backend.sh"
rm wmonline-backend.zip