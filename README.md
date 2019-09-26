### [LineageOS Statistics Model Sort](https://github.com/warren-bank/crx-lineageos-stats-model-sort)

Chrome extension for LineageOS Statistics website to automatically resort release versions of hardware models by date of release

#### notes:

* rewrites DOM on pages that match the URL: `stats.lineageos.org/model/*`
  * example: [Samsung Galaxy S5](https://stats.lineageos.org/model/klte)
* release versions are resorted from newest to oldest

#### comments:

* a fat lot of good this does, considering LineageOS doesn't maintain any archive of older ROM release versions
  * at the moment, the best option is to:
    * search Google for the name of the desired ROM release version
    * hope to find a copy
    * hope to find the hash (SHA256, SHA1, MD5) for the original ROM
    * calculate the corresponding hash for the downloaded copy
    * hope they match

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
