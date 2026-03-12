# Available Datasets in NASAMergedTb.jl

There are two different Dataset `Type`s in NASAMergedTb.jl:
* The `TbDataset` Type that contains information on a Brightness Temperature Dataset
* The `SDDataset` Type that contains classification information on whether the cloud-type is considered Shallow or Deep

The `TbDataset` type is downloaded directly from NASA OPeNDAP servers, while the `SDDataset` is calculated from the Brightness Temperature datasets that are downloaded.

## Defining a NASAMergedTb Dataset

Defining both the `TbDataset` and `SDDataset` Types is easy, all you have to define are two things:
1. Date range, ranging from `start` to `stop`
2. Data `path`, i.e. where you want to save the NASA Precipitation Data

```
DatasetFunction(
    start = Date(),
    stop  = Date(),
    path  = ...
)
```

See below for an example of defining a `TbDataset`
```@repl
using NASAMergedTb
npd = TbDataset(start=Date(2017,2,1),stop=Date(2017,2,1),path=homedir())
npd.start
npd.path
```

## Summary Table

The following are the different available Types and functions used to define them:

|                             |    `Type`   | Download? |    Function   |
| :-------------------------: | :---------: | :-------: | :-----------: |
|    Brightness Temperature   | `TbDataset` |    Yes    | `TbDataset()` |
| Shallow/Deep Classification | `SDDataset` |    No     | `SDDataset()` |