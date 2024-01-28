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

import {
  Entity,
  KindValidator,
} from '@backstage/catalog-model';
import { ajvCompiledJsonSchemaValidator } from './util';
import schema from './Schema/Environment.v1alpha1.schema.json';


/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface EnvironmentEntity extends Entity {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Environment';
  spec: {
    owner: string;
    domain?: string;
    pipeline?: string;
  };
}

/**
 * {@link KindValidator} for {@link EnvironmentEntity}.
 *
 * @public
 */
export const environmentEntityValidator =
  ajvCompiledJsonSchemaValidator(schema);
