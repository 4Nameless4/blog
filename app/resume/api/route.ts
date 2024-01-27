import { getResume } from "@/common/api";
import { base64ToString } from "@/common/utils";

export async function GET() {
  const [json, blob] = await getResume();
  let data = null;

  if (blob) {
    const _json = JSON.parse(base64ToString(json));
    const arraybuffer = await blob.arrayBuffer();

    data = {
      json: _json,
      blobArray: Array.from(new Int8Array(arraybuffer)),
    };
  }

  return Response.json({ data });
}
