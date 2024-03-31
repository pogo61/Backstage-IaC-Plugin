import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { IacSupportEntitiesProcessor } from './processor';

/**
 * Registers support for the Iac Support specific entity model (e.g. the Template
 * kind) to the catalog backend plugin.
 *
 * @public
 */
export const catalogModuleIacSupportEntityModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'catalog-backend-module-iac-support-model',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new IacSupportEntitiesProcessor());
      },
    });
  },
});
