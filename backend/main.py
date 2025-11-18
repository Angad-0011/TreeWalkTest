import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from streetlevel.mapillary import client, search

MAPILLARY_TOKEN = os.getenv("MAPILLARY_CLIENT_TOKEN")

app = FastAPI(title="TreeWalk API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NearestImageResponse(BaseModel):
    image_id: str | None
    lat: float
    lng: float
    distance: float | None
    source: str


@app.get("/nearest-image", response_model=NearestImageResponse)
async def nearest_image(lat: float, lng: float, radius: int = 100):
    if not MAPILLARY_TOKEN:
        return NearestImageResponse(
            image_id=None,
            lat=lat,
            lng=lng,
            distance=None,
            source="stub",
        )

    map_client = client.MapillaryClient(MAPILLARY_TOKEN)

    try:
        result = search.nearest_image(map_client, lat, lng, distance=radius)
    except Exception as exc:  # pragma: no cover - passthrough for network errors
        raise HTTPException(status_code=502, detail=f"Mapillary lookup failed: {exc}") from exc

    if not result:
        raise HTTPException(status_code=404, detail="No panorama found within radius")

    return NearestImageResponse(
        image_id=result.id,
        lat=lat,
        lng=lng,
        distance=getattr(result, "distance", None),
        source="mapillary",
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
