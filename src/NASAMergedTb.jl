module NASAMergedTb

## Base Modules Used
using Logging
using Printf
using Statistics

## Modules Used
using NetRC
using RegionGrids

import Base: download, show, read
import GeoRegions: in
import RegionGrids: extract

## Reexporting exported functions within these modules
using Reexport
@reexport using Dates
@reexport using GeoRegions
@reexport using NCDatasets

## Exporting the following functions:
export
        TbDataset, SDDataset,
        
        download, read, setup, extract, smoothing


modulelog() = "$(now()) - NASAMergedTb.jl"
geopath = joinpath(@__DIR__,".georegions")
mergIRpath(path) = splitpath(path)[end] !== "mergedIR" ? joinpath(path,"mergedIR") : path

function __init__()
    setup()
end

## Including Relevant Files

include("datasets/brighttemperature.jl")
include("datasets/shallowdeep.jl")

include("setup.jl")
include("download.jl")
include("classify.jl")

include("save.jl")
include("read.jl")
include("extract.jl")
# include("smoothing.jl")
include("filesystem.jl")
include("backend.jl")
end
