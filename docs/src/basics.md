# The Basics of NASAMergedTb.jl

There are two essential components in NASAMergedTb.jl

* The Dataset of interest (i.e., a Brightness Temperature TbDataset `btd` or a Classification SDDataset `sdd`)
* A geographic region of interest (i.e., a GeoRegion `geo`)

With these two components, you can perform the following actions:

* Download data of interest using `download(btd,geo)`
* Perform basic analysis on the data using `analysis(btd,geo)`
* Manipulate the data (e.g., spatiotemporal smoothing using `smooth(btd,geo,...)`)
* Classify regions of shallow and deep convection using `classify(btd,geo)`

## The `TbDataset` Type

The `TbDataset` and `SDDataset` types contains the following information:
* `start` - The beginning of the date-range of our data of interest
* `stop` - The end of the date-range of our data of interest
* `path` - The data directory in which our dataset is saved into

```@docs
NASAMergedTb.TbDataset
NASAMergedTb.SDDataset
```

## The `AbstractGeoRegion` Type

A `GeoRegion` defines the geometry/geometries of geograhical region(s) of interest. See the [documentation of GeoRegions.jl](https://georegionsecosystem.github.io/GeoRegions.jl/dev/georegions) for more information.

```@docs
GeoRegions.AbstractGeoRegion
```