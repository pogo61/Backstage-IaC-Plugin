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
