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

import {RELATION_HAS_PART,} from '@backstage/catalog-model';
import {InfoCardVariants, TableOptions} from '@backstage/core-components';
import React from 'react';
import {RelatedEntitiesCard} from '@backstage/plugin-catalog';
import {asComponentEntities, componentEntityColumns} from './presets';
// import {useEntity} from '@backstage/plugin-catalog-react';

/** @public */
export interface HasSubcomponentsCardProps {
  variant?: InfoCardVariants;
  tableOptions?: TableOptions;
  title?: string;
  relationType?: string;
}

export function HasSubcomponentsCard(props: HasSubcomponentsCardProps) {
  // const entity = useEntity();

  const {
    variant = 'gridItem',
    tableOptions = {},
    title = 'Has subcomponents',
    relationType = 'hasPart'
  } = props;
  return (
      <RelatedEntitiesCard
          variant={variant}
          title={title}
          entityKind="ResourceComponent"
          relationType={relationType}
          columns={componentEntityColumns}
          asRenderableEntities={asComponentEntities}
          emptyMessage=""
          emptyHelpLink=""
          tableOptions={tableOptions}
      />
  );
}
