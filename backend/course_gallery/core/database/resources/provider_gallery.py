from typing import List
from ....models.relations import ProviderWithAddress, PaginatedProviderResponse

class ProviderFinderResource:
    def __init__(self, db_client):
        self.db_client = db_client

    def get_providers_paginated(self, page: int = 1, limit: int = 10, addresses: bool = False) -> PaginatedProviderResponse:
        try:
            offset = (page - 1) * limit
            select_query = "*, address(*)" if addresses else "*"
            count_response = self.db_client.table("provider").select("*", count="exact").execute()
            if not count_response.data:
                return []
            total = len(count_response.data) if count_response.data else 0
            response = self.db_client.table("provider").select(select_query).range(offset, offset + limit - 1).execute()
            if not response.data:
                return []
            return self._transform_to_results_paginated(response.data, total, page, limit)
        except Exception as e:
            raise ValueError(f"Error fetching providers: {str(e)}")

    def get_provider_by_name(self, name:str) -> List[ProviderWithAddress]:
        try:
            response = self.db_client.table("provider").select("*, address(*)").ilike("name", f"%{name}%").execute()
            if not response.data:
                return []
            return self._transform_to_results(response.data)
        except Exception as e:
            raise ValueError(f"Error fetching provider by name: {str(e)}")
        
    def _transform_to_results(self,data) -> List[ProviderWithAddress]: 
        results = [ProviderWithAddress(**item) for item in data]
        for item in results:
            if not hasattr(item, 'address') or item.address is None:
                del item.address
        return results

    def _transform_to_results_paginated(self, data, total, page, limit) -> List[ProviderWithAddress]:
        results = [ProviderWithAddress(**item) for item in data]
        for item in results:
            if not hasattr(item, 'address') or item.address is None:
                del item.address
        return PaginatedProviderResponse(total=total, page=page, per_page=limit, data=results)