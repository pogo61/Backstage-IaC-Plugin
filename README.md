# Backstage IaC Plugin
I wished to extend the Entity Model use in Backstage to support first class entities that represented IaC environments and modules.

I planned to extend the model as per this diagram, adding the Environment and ResourceComponent entities:
![](static/img/extended-backstage-model.png)
The Environment entity being analogous to the System entity, and the ResourceComponent analogous to the Component. That is having IaC equivalents of the existing, software-centred, entities.  

I found the docs at https://backstage.io/docs/features/software-catalog/extending-the-model#implementing-custom-model-extensions to be very difficult to follow, especially in terms of connecting the dots on all the pieces that need to be configured. Hopefully this will find an audience that want the same capability, but also help people understand what is needed to extend the Backend model. <3

### Prerequsites

You must have a Backstage app running. If not you can create one with `npx @backstage/create-app` command

### Folders

* iac-support-common - contains the definition of the Environment and ResourceComponent entities, extremely simplified. This was built by looking at the https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/kinds and https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema code for the existing entities
* iac-support-backend - contains the validation logic used by Backstage to ensure our entities work correctly, and generate teh right relation lines. Again, I use the processors in these folders to help, but the best pointer I got was from the Backstage Discord support bods and the creation of the doEmit function.
* iac-support-frontend - front-end plugin to display the sub-ResourceComponents in the "Has Subcomponent" table
           
### Release 2 and beyond has been refactored to support the new Backend Architecture Introduced in version 1.2.4 of Backstage.
### Any version less than Release 2, is no longer supported.

### Release 2.1.0 adds the  iac-support-frontend plugin-in

### Using

1. Go to the  root directory of the Backstage app you created (the default is the backstage dir, so I'll use that as a reference here).
2. Type `yarn --cwd packages/backend add @paulpogo/plugin-catalog-backend-module-iac-support@latest` to install the plugin (note the package name change for release 2). Ensure that the plugin has installed by ensuring you see the following 
```success Saved lockfile.
success Saved 3 new dependencies.
info Direct dependencies
info All dependencies
├─ @paulpogo/plugin-catalog-backend-module-iac-support@0.0.2
├─ @paulpogo/plugin-iac-support-common@0.0.1
└─ app@0.0.0
✨  Done in 13.49s. 
```
3. For the front-end component type `yarn --cwd packages/app add @paulpogo/plugin-iac-support-frontend@latest`
```success Saved lockfile.
success Saved 1 new dependency.
info Direct dependencies
info All dependencies
└─ @paulpogo/plugin-iac-support-frontend@0.0.84
✨  Done in 14.45s.
```



3. Modify packages/backend/src/plugins/index.ts ([as per the migration guide](https://backstage.io/docs/backend-system/building-backends/migrating#migrating-the-index-file)) to include a reference to our new processor:
   ```// catalog plugin
   backend.add(import('@backstage/plugin-catalog-backend/alpha'));
   backend.add(
     import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
   );
   add this -> backend.add(import('@paulpogo/plugin-catalog-backend-module-iac-support')); ```

4. Type `yarn --cwd packages/backend add @backstage/backend-defaults @backstage/backend-plugin-api` to install the dependent backstage packages

5. Fire up Backstage `yarn dev`

### Ready to go

At this point, assuming everything worked correctly, you should be able to add your needed Environment and ResourceComponent entities as needed.
See the example repo I have created to demonstrate the plugin use,  https://github.com/pogo61/ecs-cluster-terraform, for hints on how this could work for you.

### Example catalog-info.yaml files
The example folder contains a hierarchy of catalog-info.yaml files that were generated by the [Terraform Importer](https://github.com/pogo61/backstage-terraform-importer) I created.

1. The root defines the environment (test in this case), and based group and domain.
2. The first child "modules" folder contains the definitions for the:
   1. Hashicorp IAM module
   2. An in-house ALB module
3. The next-level "modules" folder contains the definitions for the child modules and resources used in the IAM and ALB root modules
4. Use the Home->create->register existing component screen to reference the urls for these files to define them to Backstage.

**Note: the new entities will not show up in your "Home" page Component drop-down list until you create at least one of them**

**Please look out for a [Medium Article](https://medium.com/@paulpogonoski/backstage-iac-support-392f34ea118e) that describes using this in detail**

**Lastly, there is a  [Terraform Importer](https://github.com/pogo61/backstage-terraform-importer) written in Python that will create the requisite YAML files required for this plugin**
