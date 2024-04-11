/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CatalogClient } from '@backstage/catalog-client';
import {
  catalogApiRef,
  entityPresentationApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  createComponentRouteRef,
  createFromTemplateRouteRef,
  unregisterRedirectRouteRef,
  viewTechDocRouteRef,
} from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import { HasSubcomponentsCardProps } from './src';
import { rootRouteRef } from './routes';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';

/** @public */
export const iacPlugin = createPlugin({
  id: 'iac-support-frontend',
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogClient({ discoveryApi, fetchApi }),
    }),
    createApiFactory({
      api: starredEntitiesApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) =>
        new DefaultStarredEntitiesApi({ storageApi }),
    }),
    createApiFactory({
      api: entityPresentationApiRef,
      deps: { catalogApi: catalogApiRef },
      factory: ({ catalogApi }) =>
        DefaultEntityPresentationApi.create({ catalogApi }),
    }),
  ],
  routes: {
    catalogIndex: rootRouteRef,
    catalogEntity: entityRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
    createFromTemplate: createFromTemplateRouteRef,
    unregisterRedirect: unregisterRedirectRouteRef,
  },
});

/** @public */
export const EntityHasSubcomponentsCard: (
  props: HasSubcomponentsCardProps,
) => JSX.Element = iacPlugin.provide(
  createComponentExtension({
    name: 'EntityHasSubcomponentsCard',
    component: {
      lazy: () =>
        import('./src/components/HasSubcomponentsCard').then(
          m => m.HasSubcomponentsCard,
        ),
    },
  }),
);

