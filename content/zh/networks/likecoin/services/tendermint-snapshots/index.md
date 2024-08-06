---
title: 'LikeCoin 驗證人節點備份'
description: 'LikeCoin 驗證人節點用備份'
---

## 備份
備份元資料 JSON 網址:
```
https://backblaze.pikaser.net/file/pikaser-cosmos-nodes-snapshots-mainnets/likecoin/likecoin-mainnet-2/snapshots/snapshot.json
```

### 壓縮格式
[zstd](https://github.com/facebook/zstd)

解壓縮無須特別設定  
壓縮設定看下面  

### 注意事項
- 請自行承擔使用以上備份的風險，驗證人有責任自行管理使用備份(來自他人或自己)的風險
- 網址有機會無預警地更改

## 使用方法

### 方法 1: 使用 `cosmos-omnibus`
使用 Docker 映像檔 https://github.com/ovrclk/cosmos-omnibus with version `>= 0.3.2`

確保環境變數包含
```yaml
SNAPSHOT_JSON: https://backblaze.pikaser.net/file/pikaser-cosmos-nodes-snapshots-mainnets/likecoin/likecoin-mainnet-2/snapshots/snapshot.json

```

### 方法 2: 人手使用 JSON 檔
JSON 檔內容格式應為以下所示
```json
{
  "chain_id": "likecoin-mainnet-2",
  "snapshots": [
    "https://backblaze.pikaser.net/file/pikaser-cosmos-nodes-snapshots-mainnets/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-28T23:05:00.tar.zst",
    "https://backblaze.pikaser.net/file/pikaser-cosmos-nodes-snapshots-mainnets/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-29T23:05:00.tar.zst"
  ],
  "latest": "https://backblaze.pikaser.net/file/pikaser-cosmos-nodes-snapshots-mainnets/likecoin/likecoin-mainnet-2/snapshots/likecoin-mainnet-2_2022-08-29T23:05:00.tar.zst"
}

```

要取得最新備份檔網址可參考這段代碼：https://github.com/ovrclk/cosmos-omnibus/blob/v0.3.2/run.sh#L235-L237  
注意有可能需要安裝額外軟件


## PikaSer 備份"伺服器"設定
- Docker 映像檔: https://github.com/ovrclk/cosmos-omnibus
- 版本: `>= 0.3.2` (以能使用 [zstd](https://github.com/facebook/zstd) 格式，該格式支援新增於[Pull Request #268](https://github.com/ovrclk/cosmos-omnibus/pull/268))

### 環境設定

#### 環境變數
只有部分內容
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
`goleveldb` (預設值)
