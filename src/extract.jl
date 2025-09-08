"""
    extract(
        sgeo :: GeoRegion,
        btd  :: TbDataset,
        geo  :: GeoRegion,
    ) -> nothing

Extracts NASAPrecipitation data for a GeoRegion `sgeo` from a bigger GeoRegion `geo`.

!!! note
    Data for the parent GeoRegion identified by `geo` must already exist, and `sgeo` must be fully within the bounds of `geo`.

Arguments
=========
- `btd` : a `TbDataset` specifying the dataset details and date download range
- `sgeo` : a `GeoRegion` (see [GeoRegions.jl](https://github.com/GeoRegionsEcosystem/GeoRegions.jl)) that sets the geographic bounds of the data array in lon-lat
- `geo` : a `GeoRegion` that is a "parent" of the `GeoRegion` of interest `sgeo`, in the sense that `sgeo` must be fully within `geo`.
"""
function extract(
	sgeo :: GeoRegion,
    btd  :: TbDataset,
	geo  :: GeoRegion,
)

    in(sgeo,geo)

    @info "$(modulelog()) - Retrieving GeoRegion and LandSea Dataset information for the parent GeoRegion of \"$(geo.ID)\", \"$(geo.pID)\""
    plon,plat = btdlonlat()
    ggrd = RegionGrid(geo,plon,plat)
    plon = ggrd.lon; nplon = length(plon)
    plat = ggrd.lat; nplat = length(plat)

    @info "$(modulelog()) - Creating RegionGrid for \"$(sgeo.ID)\" based on the longitude and latitude vectors of the parent GeoRegion \"$(geo.pID)\""

    ggrd = RegionGrid(sgeo,plon,plat)
    nlon = length(ggrd.ilon)
    nlat = length(ggrd.ilat)
    
    pmat = zeros(Float32,nplon,nplat,48); rmat = zeros(Float32,nlon,nlat,48)
    pmsk = zeros(Float32,nplon,nplat,48); rmsk = zeros(Float32,nlon,nlat,48)

    for dt in btd.start : Day(1) : btd.stop

        pds  = read(btd,geo,dt)
        NCDatasets.load!(pds["Tb"].var,pmat,:,:,:)
        NCDatasets.load!(pds["mask"].var,pmsk,:,:,:)
        close(pds)

        @info "$(modulelog()) - Extracting the $(btd.name) precipitation data in $(sgeo.name) GeoRegion from the $(geo.name) GeoRegion for $(year(dt)) $(Dates.monthname(dt))"

        extract!(rmat,pmat,ggrd)
        extract!(rmsk,pmsk,ggrd)

        save(rmat,rmsk,dt,btd,sgeo,ggrd)

        flush(stderr)

    end

end