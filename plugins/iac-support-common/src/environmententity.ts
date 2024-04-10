import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
// import { ajvCompiledJsonSchemaValidator } from './util';
import schema from './Schema/Environment.v1alpha1.schema.json';


/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface environmentEntity extends Entity {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Environment';
  spec: {
    owner: string;
    domain?: string;
    pipeline?: string;
  };
}

const validator = entityKindSchemaValidator(schema);
/**
 * {@link KindValidator} for {@link environmentEntity}.
 *
 * @public
 */
// export const environmentEntityValidator =
//   ajvCompiledJsonSchemaValidator(schema);

export const environmentEntityValidator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};
