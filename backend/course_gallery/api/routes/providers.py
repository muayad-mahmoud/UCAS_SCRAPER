from fastapi import APIRouter, HTTPException,Depends, Query
from typing import List
from ...core.database.db_client import DBClient
from ...core.database.resources.provider_gallery import ProviderFinderResource
from ...models.relations import ProviderWithAddress, PaginatedProviderResponse

router = APIRouter(prefix="/providers", tags=["Providers"])

def get_provider_resource():
    db_client = DBClient()
    return ProviderFinderResource(db_client)

@router.get("/", response_model=PaginatedProviderResponse)
def get_providers(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, description="Number of providers to return"),
    addresses: bool = Query(False, description="Include Address Information in Response"),
    resource: ProviderFinderResource = Depends(get_provider_resource)
):
    try:
        return resource.get_providers_paginated(page=page, limit=limit, addresses=addresses)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/search", response_model=List[ProviderWithAddress])
def search_providers(
    name: str,
    resource: ProviderFinderResource = Depends(get_provider_resource)
):
    try:
        return resource.get_provider_by_name(name=name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
