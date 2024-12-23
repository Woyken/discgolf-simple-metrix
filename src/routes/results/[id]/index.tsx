import { A, useParams, useSearchParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/solid-table';
import { type Accessor, For, Show, createMemo } from 'solid-js';
import type { discGolfMetrixGetCompetitionThrows } from '~/apiWrapper/getCompetitionThrows';
import { getCompetitionThrowsQueryOptions } from '~/components/mapbox/query/query';
import { PlayerAvatar, PlayerAvatarFromName } from '~/components/playerAvatar';
import { QueryBoundary } from '~/components/QueryBoundary';
import {
  Table
  TableBody
  TableCell
  TableHead,
  TableHeader
  TableRow
