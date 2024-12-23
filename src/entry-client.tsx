// @refresh reload
import { StartClient, mount } from '@solidjs/start/client';

const root = document.getElementById('app');
if (!root) throw new Error('Missing root element');

mount(() => <StartClient />, root);
