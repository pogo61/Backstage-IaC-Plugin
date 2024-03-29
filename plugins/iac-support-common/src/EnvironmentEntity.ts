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
