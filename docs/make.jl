using Documenter
using DocumenterVitepress
using NASAMergedTb
import CairoMakie

CairoMakie.activate!(type = "svg")

DocMeta.setdocmeta!(NASAMergedTb, :DocTestSetup, :(using GeoRegions); recursive=true)

makedocs(;
    modules  = [GeoRegions,NASAMergedTb],
    authors  = "Nathanael Wong <natgeo.wong@outlook.com>",
    sitename = "NASAMergedTb.jl",
    doctest  = false,
    warnonly = true,
    format   = DocumenterVitepress.MarkdownVitepress(
        repo = "https://github.com/GeoRegionsEcosystem/NASAMergedTb.jl",
    ),
    pages=[
        "Home"        => "index.md",
        "The Basics"  => "basics.md",
        # "Tutorials"  => [
        #     "Downloading Datasets"        => "tutorials/download.md",
        #     "Integration with LandSea.jl" => "tutorials/landsea.md",
        #     "Extraction of subGeoRegions" => "tutorials/extract.md",
        #     "Spatialtemporal Smoothing"   => "tutorials/smoothing.md",
        # ],
        # "API"       => [
        #     "IMERG Datasets" => "api/imerg.md",
        #     "TRMM Datasets"  => "api/trmm.md",
        #     "Dummy Datasets" => "api/dummy.md",
        # ],
    ],
)

recursive_find(directory, pattern) =
    mapreduce(vcat, walkdir(directory)) do (root, dirs, files)
        joinpath.(root, filter(contains(pattern), files))
    end

files = []
for pattern in [r"\.cst", r"\.nc", "test.geo"]
    global files = vcat(files, recursive_find(@__DIR__, pattern))
end

for file in files
    rm(file)
end

DocumenterVitepress.deploydocs(;
    repo      = "github.com/GeoRegionsEcosystem/NASAMergedTb.jl.git",
    target    = "build", # this is where Vitepress stores its output
    devbranch = "main",
    branch    = "gh-pages",
    push_preview = true,
)
