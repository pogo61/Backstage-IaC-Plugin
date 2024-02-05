import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_MEMBER,
  RELATION_HAS_PART,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';

import {
  EnvironmentEntity,
  environmentEntityValidator, ResourceComponentEntity,
  resourceComponentEntityValidator,
} from '@paulpogo/plugin-iac-support-common';

/**
 * Adds support for Iac Support specific entity kinds to the catalog.
 *
 * @public
 */
export class IacSupportEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'IacSupportEntitiesProcessor';
  }

  private readonly validators = [resourceComponentEntityValidator, environmentEntityValidator];

  // validateEntityKind is responsible for signaling to the catalog processing
  // engine that this entity is valid and should therefore be submitted for
  // further processing.
  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (await validator.check(entity)) {
        return true;
      }
    }

    // Returning false signals that we don't know what this is, passing the
    // responsibility to other processors to try to validate it instead.
    return false;
  }


  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    /*
     * Utilities
     */

    function doEmit(
      targets: string | string[] | undefined,
      context: { defaultKind?: string; defaultNamespace: string },
      outgoingRelation: string,
      incomingRelation: string,
    ): void {
      if (!targets) {
        return;
      }
      for (const target of [targets].flat()) {
        const targetRef = parseEntityRef(target, context);
        emit(
          processingResult.relation({
            source: selfRef,
            type: outgoingRelation,
            target: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
          }),
        );
        emit(
          processingResult.relation({
            source: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
            type: incomingRelation,
            target: selfRef,
          }),
        );
      }
    }

    if (
      entity.apiVersion === 'backstage.io/v1alpha1' &&
      entity.kind === 'Environment'
    ) {

      /*
       * Emit relations for the Environment kind
       */
      const environment = entity as EnvironmentEntity;
      doEmit(
        environment.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        environment.spec.domain,
        { defaultKind: 'Domain', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
      doEmit(
        environment.spec.pipeline,
        { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
        RELATION_HAS_PART,
        RELATION_PART_OF,
      );
    }

    if (
      entity.apiVersion === 'backstage.io/v1alpha1' &&
      entity.kind === 'ResourceComponent'
    ) {

      /*
       * Emit relations for the Resource Component kind
       */
      const resourcecomponent = entity as ResourceComponentEntity;
      doEmit(
        resourcecomponent.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        resourcecomponent.spec.dependsOn,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
      doEmit(
        resourcecomponent.spec.environment,
        { defaultKind: 'Environment', defaultNamespace: selfRef.namespace },
        RELATION_MEMBER_OF,
        RELATION_HAS_MEMBER,
      );
    }

    return entity;
  }
}
