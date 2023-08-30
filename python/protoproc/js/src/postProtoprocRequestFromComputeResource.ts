import { signMessage } from "./signatures";
import { isProtoprocResponse, ProtoprocRequest, ProtoprocRequestPayload, ProtoprocResponse } from "./types/ProtoprocRequest";

const postProtoprocRequestFromComputeResource = async (req: ProtoprocRequestPayload, o: {computeResourceId: string, computeResourcePrivateKey: string}): Promise<ProtoprocResponse | undefined> => {
    const rr: ProtoprocRequest = {
        payload: req,
        fromClientId: o.computeResourceId,
        signature: await signMessage(req, o.computeResourceId, o.computeResourcePrivateKey)
    }

    const protoprocUrl = process.env.PROTOPROC_URL || 'https://protoproc.vercel.app'
    // const protoprocUrl = process.env.PROTOPROC_URL || 'http://localhost:3000'

    try {
        const resp = await fetch(`${protoprocUrl}/api/protoproc`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(rr),
        })
        const responseText = await resp.text()
        let responseData: any
        try {
            responseData = JSON.parse(responseText)
        }
        catch (err) {
            console.warn(responseText)
            throw Error('Unable to parse protoproc response')
        }
        if (!isProtoprocResponse(responseData)) {
            console.warn(JSON.stringify(responseData, null, 2))
            throw Error('Unexpected protoproc response')
        }
        return responseData
    }
    catch (err) {
        console.warn(err)
        console.info(`Unable to post protoproc request: ${err.message}`)
        return undefined
    }
}

export default postProtoprocRequestFromComputeResource