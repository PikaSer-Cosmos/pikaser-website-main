---
title: 'LikeCoin Validator Node Snapshots'
description: 'LikeCoin snapshots for validators'
---

## Snapshots
Snapshot metadata JSON URL:
```
https://pikaser-cosmos-nodes-snapshots-storj.s3.filebase.com/likecoin/likecoin-mainnet-2/snapshots/snapshot.json
```

### Archive Format
[zstd](https://github.com/facebook/zstd)

No special setup required for decompression  
See compression settings below  

### Notice
- Use these snapshots at your own risk. It's validators' responsibility to ensure things don't blow up by using external or internal snapshots.
- URLs might change without notice (well how do you get notified anyway...)

## Usage

### Method 1: Use `cosmos-omnibus`
Use Docker image https://github.com/ovrclk/cosmos-omnibus with version `>= 0.3.2`

Ensure environment variables include:
```yaml
SNAPSHOT_JSON: https://pikaser-cosmos-nodes-snapshots-storj.s3.filebase.com/likecoin/likecoin-mainnet-2/snapshots/snapshot.json

```

### Method 2: Use the JSON manually
The content of the JSON file should look like the following
```json
{
  "chain_id": "likecoin-mainnet-2",
  "snapshots": [
    "https://pikaser-cosmos-nodes-snapshots-storj.s3.filebase.com/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-28T23:05:00.tar.zst",
    "https://pikaser-cosmos-nodes-snapshots-storj.s3.filebase.com/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-29T23:05:00.tar.zst"
  ],
  "latest": "https://pikaser-cosmos-nodes-snapshots-storj.s3.filebase.com/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-29T23:05:00.tar.zst"
}

```

To get the URL for actual snapshot use something like https://github.com/ovrclk/cosmos-omnibus/blob/v0.3.2/run.sh#L235-L237  
Beware that additional dependencies might need to be installed  


## PikaSer Snapshot "Server" Setup
- Docker image: https://github.com/ovrclk/cosmos-omnibus
- Version: `>= 0.3.2` (To use [zstd](https://github.com/facebook/zstd) format with support added in [Pull Request #268](https://github.com/ovrclk/cosmos-omnibus/pull/268))

### Environment

#### Environment Variables
Only partial content
```yaml
# Format
SNAPSHOT_SAVE_FORMAT: "tar.zst"
# ZSTD
# https://github.com/facebook/zstd/blob/v1.5.2/programs/zstd.1.md#restricted-usage-of-environment-variables
ZSTD_CLEVEL: "19"
ZSTD_LONG: "27"
ZSTD_NBTHREADS: "0"

# Pruning
# https://polkachu.com/blogs/holy-trinity-a-system-approach-to-tendermint-based-chain-validation
#
# Issue might occur if `keep-every` set to `0`: https://github.com/likecoin/likecoin-chain/issues/40
# Might already been fixed but requires cosmos-sdk upgrade: https://github.com/cosmos/cosmos-sdk/pull/11152
LIKED_PRUNING:              "custom"
# These are applied if and only if the pruning strategy is `custom`.
LIKED_PRUNING_KEEP_RECENT:  "100"
LIKED_PRUNING_KEEP_EVERY:   "0"
# This value is copied from Polkachu
# Probably a workaround for an issue in pruning
# https://github.com/polkachu/cosmos-validators
LIKED_PRUNING_INTERVAL:     "19"
# Keep the storage requirement small
LIKED_TX_INDEX_INDEXER:     "null"

# Must be a multiple of pruning-keep-every.
LIKED_STATESYNC_SNAPSHOT_INTERVAL: "0"
# On Likecoin 3.0.0, "keep recent" default value is 2
# https://github.com/likecoin/likecoin-chain/blob/v3.0.0/cmd/liked/cmd/cmd.go#L147-L148
LIKED_STATESYNC_SNAPSHOT_KEEP_RECENT: "0"

```

#### DB Backend (`config.toml` => `db_backend`)
`goleveldb` (Default value)
