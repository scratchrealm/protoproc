import { isProtoprocResponse, ProtoprocRequest, ProtoprocRequestPayload, ProtoprocResponse } from "../types/ProtoprocRequest";

const postProtoprocRequest = async (req: ProtoprocRequestPayload, o: {userId?: string, githubAccessToken?: string}): Promise<ProtoprocResponse> => {
    const rr: ProtoprocRequest = {
        payload: req
    }
    if ((o.userId) && (o.githubAccessToken)) {
        rr.githubAccessToken = o.githubAccessToken
        rr.userId = o.userId
    }
    const resp = await fetch('/api/protoproc', {
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
    } catch (e) {
        console.error(responseText)
        throw Error('Problem parsing protoproc response')
    }
    if (!isProtoprocResponse(responseData)) {
        console.warn(JSON.stringify(responseData, null, 2))
        throw Error('Unexpected protoproc response')
    }
    return responseData
}

export default postProtoprocRequest