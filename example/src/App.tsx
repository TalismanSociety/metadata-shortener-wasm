import "./App.css";

import { useCallback, useState } from "react";
import { getShortMetadata } from "./utils/getShortMetadataFromWasm";

import { getShortMetadataFromApi } from "./utils/getShortMetadataFromApi";
import {
  DEFAULT_API_URL,
  DEFAULT_CHAIN_ID,
  DEFAULT_PAYLOAD,
  DEFAULT_WS_URL,
} from "./utils/constants";

function App() {
  const [strPayload, setStrPayload] = useState(
    JSON.stringify(DEFAULT_PAYLOAD, undefined, 2)
  );
  const [wsUrl, setWsUrl] = useState(DEFAULT_WS_URL);

  const [zondaxChainId, setZondaxChainId] = useState(DEFAULT_CHAIN_ID);
  const [zondaxApiUrl, setZondaxApiUrl] = useState(DEFAULT_API_URL);

  const [outputZondax, setOutputZondax] = useState("");
  const [outputLocal, setOutputLocal] = useState("");

  const compareOutputs = useCallback(async () => {
    setOutputZondax("Loading...");
    setOutputLocal("Loading...");

    try {
      const payload = JSON.parse(strPayload);
      setOutputZondax(
        await getShortMetadataFromApi(zondaxApiUrl, zondaxChainId, payload)
      );
    } catch (err) {
      setOutputZondax("ERROR: " + (err as Error).message);
    }

    try {
      const payload = JSON.parse(strPayload);
      setOutputLocal(await getShortMetadata(wsUrl, payload));
    } catch (err) {
      setOutputLocal("ERROR: " + (err as Error).message);
    }
  }, [strPayload, wsUrl, zondaxApiUrl, zondaxChainId]);

  return (
    <div style={{ width: 600 }}>
      <div>
        <textarea
          defaultValue={strPayload}
          onChange={(e) => setStrPayload(e.target.value)}
          style={{ width: "100%", height: 500 }}
        />
      </div>
      <fieldset>
        <legend>shorten with Zondax api</legend>
        <div
          style={{
            display: "flex",
            gap: 8,
            whiteSpace: "nowrap",
            alignItems: "center",
          }}
        >
          <div>Chain id:</div>
          <input
            type="text"
            defaultValue={zondaxChainId}
            onChange={(e) => setZondaxChainId(e.target.value)}
            style={{ width: "100%", height: 30, padding: "0 5px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            whiteSpace: "nowrap",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div>Endpoint Url: </div>
          <input
            type="text"
            defaultValue={zondaxApiUrl}
            style={{ width: "100%", height: 30, padding: "0 5px" }}
            onChange={(e) => setZondaxApiUrl(e.target.value)}
          />
        </div>
        <div
          style={{
            overflow: "auto",
            maxHeight: 200,
            width: "100%",
            maxWidth: "100%",
            wordBreak: "break-all",
            textAlign: "left",
            marginTop: 8,
          }}
        >
          {outputZondax}
        </div>
      </fieldset>
      <fieldset>
        <legend>shorten with local wasm</legend>
        <div
          style={{
            display: "flex",
            gap: 8,
            whiteSpace: "nowrap",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div>Node WS Url: </div>
          <input
            placeholder="wsUrl"
            type="text"
            defaultValue={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            style={{ width: "100%", height: 30, padding: "0 5px" }}
          />
        </div>
        <div
          style={{
            overflow: "auto",
            maxHeight: 200,
            width: "100%",
            maxWidth: "100%",
            wordBreak: "break-all",
            textAlign: "left",
            marginTop: 8,
          }}
        >
          {outputLocal}
        </div>
      </fieldset>
      <div style={{ padding: 16 }}>
        <button
          type="button"
          onClick={compareOutputs}
          style={{ width: "100%" }}
        >
          check
        </button>
      </div>
    </div>
  );
}

export default App;
