import { GetComputeResourcesRequest, GetComputeResourcesResponse } from "../../src/types/ProtoprocRequest";
import { isProtoprocComputeResource } from "../../src/types/protoproc-types";
import { getMongoClient } from "../getMongoClient";
import removeIdField from "../removeIdField";

const getComputeResourcesHandler = async (request: GetComputeResourcesRequest, o: {verifiedClientId?: string, verifiedUserId?: string}): Promise<GetComputeResourcesResponse> => {
    const userId = o.verifiedUserId

    const client = await getMongoClient()
    const computeResourcesCollection = client.db('protoproc').collection('computeResources')
    
    const computeResources = removeIdField(await computeResourcesCollection.find({ownerId: userId}).toArray())
    for (const cr of computeResources) {
        if (!isProtoprocComputeResource(cr)) {
            console.warn(cr)
            throw new Error('Invalid compute resource in database (1)')
        }
    }
    return {
        type: 'getComputeResources',
        computeResources
    }
}

export default getComputeResourcesHandler