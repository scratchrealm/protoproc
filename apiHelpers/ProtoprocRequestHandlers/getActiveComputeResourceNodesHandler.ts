import { GetActiveComputeResourceNodesRequest, GetActiveComputeResourceNodesResponse } from "../../src/types/ProtoprocRequest";
import { getMongoClient } from "../getMongoClient";
import removeIdField from "../removeIdField";

const getActiveComputeResourceNodesHandler = async (request: GetActiveComputeResourceNodesRequest, o: {verifiedClientId?: string, verifiedUserId?: string}): Promise<GetActiveComputeResourceNodesResponse> => {
    if (!request.computeResourceId) {
        throw new Error('No computeResourceId provided')
    }
    const client = await getMongoClient()
    const computeResourceNodesCollection = client.db('protoproc').collection('computeResourceNodes')
    const computeResourceNodes = removeIdField(await computeResourceNodesCollection.find({
        computeResourceId: request.computeResourceId,
    }).toArray())
    return {
        type: 'getActiveComputeResourceNodes',
        activeComputeResourceNodes: computeResourceNodes.map((crn: any) => ({
            computeResourceId: crn.computeResourceId,
            nodeId: crn.nodeId,
            nodeName: crn.nodeName,
            timestampLastActive: crn.timestampLastActive
        }))
    }
}

export default getActiveComputeResourceNodesHandler