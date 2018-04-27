import handlers from './handlers';
import { isValidEventType } from 'shared/enclave/utils';
import { RpcRequest, RpcEventSuccess, RpcEventFailure, EventResponse } from 'shared/enclave/types';
import { ipcRenderer } from 'electron';

async function processRequest(req: RpcRequest) {
  ipcRenderer.send('hi', 'there');
  ipcRenderer.on('poo', () => console.log('got the poo'));
  /*
  try {
    console.info(`Calling handlers `);

    const data = await handlers[req.type](req.params);
    if (data) {
      console.info(`Got data ${JSON.stringify(data, null, 1)}`);
      respondWithPayload(req, data);
    }
  } catch (err) {
    console.error('Request', req.type, 'failed with error:', err);
    respondWithError(req, err.toString());
  }*/
}

function respondWithPayload(req: RpcRequest, payload: EventResponse) {
  const response: RpcEventSuccess = {
    id: req.id,
    isResponse: true,
    errMsg: undefined,
    payload
  };
  console.log(`Posting message ${response}`);
  window.postMessage(JSON.stringify(response), window.location.origin);
}

function respondWithError(req: RpcRequest, errMsg: string) {
  const response: RpcEventFailure = {
    id: req.id,
    isResponse: true,
    payload: undefined,
    errMsg
  };
  window.postMessage(JSON.stringify(response), window.location.origin);
}

export function registerServer() {
  window.addEventListener('message', (ev: MessageEvent) => {
    console.info(`Received event ${JSON.stringify(ev, null, 1)}`);
    // Only take in messages from the webview
    if (ev.origin !== window.location.origin) {
      console.info('Returning because wrong origin');
      return;
    }

    try {
      console.info(`Parsing request`);
      const request = JSON.parse(ev.data);
      if (request && request.isRequest && isValidEventType(request.type)) {
        console.info(`Processing request request`);

        processRequest(request as RpcRequest);
      }
    } catch (err) {
      console.error(err);
      // no-op, not meant for us
    }
  });
}
