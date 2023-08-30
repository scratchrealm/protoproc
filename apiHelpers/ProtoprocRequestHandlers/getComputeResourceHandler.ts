import { GetComputeResourceRequest, GetComputeResourceResponse } from "../../src/types/ProtoprocRequest";
import { isProtoprocComputeResource } from "../../src/types/protoproc-types";
import { getMongoClient } from "../getMongoClient";
import removeIdField from "../removeIdField";

const getComputeResourceHandler = async (request: GetComputeResourceRequest, o: {verifiedClientId?: string, verifiedUserId?: string}): Promise<GetComputeResourceResponse> => {
    const client = await getMongoClient()
    const computeResourcesCollection = client.db('protoproc').collection('computeResources')
    
    const computeResource = removeIdField(await computeResourcesCollection.findOne({computeResourceId: request.computeResourceId}))
    if (!isProtoprocComputeResource(computeResource)) {
        console.warn(computeResource)
        throw new Error('Invalid compute resource in database (1)')
    }
    return {
        type: 'getComputeResource',
        computeResource
    }
}

export default getComputeResourceHandler