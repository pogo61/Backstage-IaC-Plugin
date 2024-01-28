# Backstage IaC Plugin
I wished to extend the Entity Model use in Backstage to support first class entities that represented IaC environments and modules.

I planned to extend the model as per this diagram, adding the Environment and ResourceComponent entities:
![](/Users/paulpog/IdeaProjects/Backstage-IaC-Plugin/Untitled Diagram.drawio.png)
The Environment entity being analogous to the System entity, and the ResourceComponent analogous to the Component. That is having IaC equivalents of the existing, software-centred, entities.  

I found the docs at https://backstage.io/docs/features/software-catalog/extending-the-model#implementing-custom-model-extensions to be very difficult to follow, especially in terms of connecting the dots on all the pieces that need to be configured. Hopefully this will find an audience that want the same capability, but also help people understand what is needed to extend the Backend model. <3

### Prerequsites

You must have a Backstage app running. If not you can create one with `npx @backstage/create-app` command

### Folders

* customer-common - contains the definition of our Customer entity, extremely simplified. This was buily by copying the https://github.com/backstage/backstage/tree/master/plugins/scaffolder-common package and removing unnecessary stuff.
* customer-backend - contains the validation logic used by Backstage to ensure our entity works correctly. This was generated with `yarn new --select backend-plugin` and modified to remove unnecessary stuff.

### Using

* 1\. Go to the  root directory of the Backstage app you created (the default is the backstage dir, so i'll use that as a reference here).
* 2\. Create the requisite wiring for a backstage backend plugin by using this command:
  * 2\.1 `yarn new --select plugin-backend`
  * 2\.2 use the value 'iac-support' when prompted for the backend plugin name
* 3\. Copy the iac-support-backend folder from the repo's plugins/ folder replacing the same in the  plugins/ folder of your backstage app
* 4\. Create the requisite wiring for a common backend plugin by using this command:
  * 4\.1 `yarn new --select plugin-common`
  * 4\.2 use the value 'iac-support' when prompted for the backend plugin name
* 5\. Copy the iac-support-common folder from the repo's plugins/ folder replacing the same in the  plugins/ folder of your backstage app
* 6\. Modify the packages/backend/package.json file to include a reference to the plugins:
    ```
    "@internal/plugin-iac-support-backend": "^0.1.0",  
    "@internal/plugin-iac-support-common": "^0.1.0",
    ```
* 7\. Modify packages/backend/src/plugins/catalog.ts to include a reference to our new processor:
   ```
   import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
   import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
   import { IacSupportEntitiesProcessor } from '@internal/plugin-iac-support-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
   
   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
     builder.addProcessor(new ScaffolderEntitiesProcessor());
     builder.addProcessor(new IacSupportEntitiesProcessor());
     const { processingEngine, router } = await builder.build();
     await processingEngine.start();
     return router;
   }

    ```
* 8\. In app-config.yaml, add the following entities to the catalog/rules/allow list:
    ```
    catalog:
    import:
        entityFilename: catalog-info.yaml
        pullRequestBranchName: backstage-integration
    rules:
        - allow: [Component, System, API, Resource, Location, Group, Domain, Environment, ResourceComponent, Template]
    ```
* 9\. Fire up Backstage `yarn dev`

### Ready to go

At this point, assuming everything worked correctly, you should be able to add your needed Environment and ResourceComponent entities as needed.
See the example repo I have created to demonstrate the plugin use,  https://github.com/pogo61/ecs-cluster-terraform, for hints on how this could work for you.

**Note: the new entities will not show up in your "Home" page Component drop-down list until you create at least one of them**

**Please look out for a Medium Article I'll write to explain this plugin**
