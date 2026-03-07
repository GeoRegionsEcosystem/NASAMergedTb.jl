"""
    download(
        btd :: NASAPrecipitationDataset,
        geo :: GeoRegion = GeoRegion("GLB");
	    overwrite :: Bool = false
    ) -> nothing

Downloads a NASA Precipitation dataset specified by `btd` for a GeoRegion specified by `geo`

Arguments
=========
- `btd` : a `NASAPrecipitationDataset` specifying the dataset details and date download range
- `geo` : a `GeoRegion` (see [GeoRegions.jl](https://github.com/JuliaClimate/GeoRegions.jl)) that sets the geographic bounds of the data array in lon-lat

Keyword Arguments
=================
- `overwrite` : If `true`, overwrite any existing files
"""
function download(
	btd :: TbDataset{ST,DT},
	geo :: GeoRegion = GeoRegion("NASATB",path=geopath);
	overwrite :: Bool = false
) where {ST<:AbstractString, DT<:TimeType}

	geo.ID == "NASATB" ? in(geo,GeoRegion("NASATB",path=geopath)) : nothing

	@info "$(modulelog()) - Downloading $(btd.name) data for the $(geo.name) GeoRegion from $(btd.start) to $(btd.stop)"

	lon,lat = btdlonlat(); nlon = length(lon)
	ggrd = RegionGrid(geo,lon,lat)

	@info "$(modulelog()) - Preallocating temporary arrays for extraction of $(btd.name) data for the $(geo.name) GeoRegion from the original gridded dataset"
	glon = ggrd.lon; nglon = length(glon); iglon = ggrd.ilon
	glat = ggrd.lat; nglat = length(glat); iglat = ggrd.ilat
	tmp0 = zeros(Int16,nglon,nglat,2)
	var  = zeros(Float32,nglon,nglat,48)
	mask = ones(Float32,nglon,nglat,48)

	if iglon[1] > iglon[end]
		shift = true
		iglon1 = iglon[1] : nlon; niglon1 = length(iglon1)
		iglon2 = 1 : iglon[end];  niglon2 = length(iglon2)
		tmp1 = @view tmp0[1:niglon1,:,:]
		tmp2 = @view tmp0[niglon1.+(1:niglon2),:,:]
		@info "Temporary array sizes: $(size(tmp1)), $(size(tmp2))"
	else
		shift = false
		iglon = iglon[1] : iglon[end]
	end

	if iglat[1] > iglat[end]
		iglat = iglat[1] : -1 : iglat[end]
	else
		iglat = iglat[1] : iglat[end]
	end

	for dt in btd.start : Day(1) : btd.stop

		fnc = btdfnc(btd,geo,dt)
		if overwrite || !isfile(fnc)

			@info "$(modulelog()) - Downloading $(btd.name) data for the $(geo.name) GeoRegion from the NASA Earthdata servers using OPeNDAP protocols for $(dt) ..."

			ymdfnc = Dates.format(dt,dateformat"yyyymmdd")
			btddir = joinpath(btd.hroot,"$(year(dt))",@sprintf("%03d",dayofyear(dt)))
			
			for it = 1 : 24

				@debug "$(modulelog()) - Loading data into temporary array for timestep $(dyfnc[it])"

				btdfnc = "$(btd.fpref)_$ymdfnc$(@sprintf("%02d",it-1))_$(btd.fsuff)"

				tryretrieve = 0
				ds = 0
				while !(typeof(ds) <: NCDataset) && (tryretrieve < 20)
					if tryretrieve > 0
						@info "$(modulelog()) - Attempting to request data from NASA OPeNDAP servers on Attempt $(tryretrieve+1) of 20"
					end
					ds = NCDataset(joinpath(btddir,btdfnc))
					tryretrieve += 1
				end
				
				if !shift
					NCDatasets.load!(ds["Tb"].var,tmp0,iglon,iglat,:)
				else
					NCDatasets.load!(ds["Tb"].var,tmp1,iglon1,iglat,:)
					NCDatasets.load!(ds["Tb"].var,tmp2,iglon2,iglat,:)
				end
				close(ds)

				@debug "$(modulelog()) - Extraction of data from temporary array for the $(geo.name) GeoRegion"
				for ihr = 1 : 2
					ii = (it-1)*2+ihr
					for ilat = 1 : nglat, ilon = 1 : nglon
						varii = tmp0[ilon,ilat,ihr]
						if !isnan(ggrd.mask[ilon,ilat])
							var[ilon,ilat,ii]  = NaN32
							mask[ilon,ilat,ii] = NaN32
						elseif (varii != -9999.0f0)
							var[ilon,ilat,ii] = varii
						else
							lonb = -1; lone = 1; latb = -1; late = 1
							if isone(ilon); lonb = 0; elseif ilon == nglon; lone = 0 end
							if isone(ilat); latb = 0; elseif ilat == nglat; late = 0 end
							tmp1 = @view tmp0[ilon.+(lonb:lone),ilat.+(latb:late),ihr]
							tmp1 = @view tmp1[.!isnan.(tmp1)]
							mask[ilon,ilat,ii] = mean(.!isnan.(tmp1))
							if !isempty(tmp1)
								 var[ilon,ilat,ii] = round(mean(tmp1)) # Round to nearest integer like the data
							else var[ilon,ilat,ii] = NaN32
							end
						end
					end
				end
			end

			save(var,mask,dt,btd,geo,ggrd)

		else

			@info "$(modulelog()) - $(btd.name) data for the $(geo.name) GeoRegion from the NASA Earthdata servers using OPeNDAP protocols for $(dt) exists in $(fnc), and we are not overwriting, skipping to next timestep ..."

		end

		flush(stderr)

	end

end