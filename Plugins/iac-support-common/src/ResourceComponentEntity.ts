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
import schema from './Schema/ResourceComponent.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Component kind Entity. Represents a single, individual piece of software.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ResourceComponentEntity extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'ResourceComponent';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesVariables?: string[];
    dependsOn?: string[];
    environment?: string;
  };
}

/**
 * {@link KindValidator} for {@link ResourceComponentEntity}.
 *
 * @public
 */
export const resourceComponentEntityValidator =
  ajvCompiledJsonSchemaValidator(schema);
