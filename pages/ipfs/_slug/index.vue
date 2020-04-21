<template>
  <div class="container">
    <div>
      <b-modal id="disclaimer" title="Disclaimer" @ok="acceptDisclaimer" @cancel="cancelDisclaimer">
        <p class="my-4">
          <strong>You are responsible for your own actions</strong>: Some of the underlying Javascript libraries uses are under active development. While most are thoroughly tested & have been used and being used by alot of people all over the globe, there is always the possibility of something unexpected to happen. <strong>Please do not use this Dapp if you are not sure what you are doing.</strong>
        </p><hr>
        <div class="license">
          <p class="my-4 text-center" style="font-weight:bold">
            MIT License <br>
            Copyright (c) 2020 Devpod IT Solutions
          </p>
          <p class="my-4">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </b-modal>
    </div>
    <div class="centerx search">
      <div style="position: absolute; top: 50px;">
        <b-alert
          :show="dismissCountDown"
          dismissible
          variant="warning"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
        >
          {{ alertmessage }}
        </b-alert>
      </div>
      <b-card bg-variant="light">
        <div v-show="page !== 'start'" class="float-right">
          <b-button variant="default" size="xs" to="/" @click="toHome">
            <b-img src="~/assets/images/home.svg" fluid />
          </b-button>
        </div>
        <div v-show="page !== 'start'">
          <b-button variant="default" size="xs" to="/" @click="backToDomain">
            <b-img src="~/assets/images/left.svg" fluid />
          </b-button>
        </div>
        <b-card-body v-if="page==='start'">
          <b-card-title class="domain">
            <h5>Sub.Crypto Manager</h5>
          </b-card-title>
          <b-card-sub-title class="mb-2 text-center">
            This Dapp allows you to add and manage a subdomain for your .crypto domain names
          </b-card-sub-title>
          <b-card-text>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <span class="icon">
                    <b-img src="~/assets/ud/ud-icon.png" fluid />
                  </span>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                v-model="domain"
                :state="state"
                type="text"
                placeholder="Enter your .crypto domain"
                @input="validate"
                @keyup.enter="enterDomain"
              />
              <b-input-group-prepend>
                <b-input-group-text>
                  .crypto
                </b-input-group-text>
              </b-input-group-prepend>
            </b-input-group>
          </b-card-text>
        </b-card-body>
        <b-card-body v-else-if="page==='manage'">
          <b-card-title class="domain">
            <h4>{{ domain }}</h4>
          </b-card-title>
          <b-card-sub-title class="mb-2" />
          <b-card-text class="owner">
            <b-alert show variant="secondary">
              <h5>Owner</h5>
              <a :href="'https://etherscan.io/address/'+domainOwner" rel="noreferrer noopener" target="_blank">
                {{ domainOwner }}
              </a>
            </b-alert>
          </b-card-text>
          <b-form-group label-for="input-subdomain" description="Note: This app does not store the list of subdomains, you will have to manually enter it above">
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>
                  <span class="icon">
                    <b-img src="~/assets/ud/ud-icon.png" fluid />
                  </span>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                id="input-subdomain"
                v-model="subDomain"
                :state="state"
                type="text"
                placeholder="Subdomain to Add or Manage"
                @input="validate"
                @keyup.enter="enterSubDomain"
              />
              <b-input-group-prepend>
                <b-input-group-text>
                  .{{ domain }}
                </b-input-group-text>
              </b-input-group-prepend>
            </b-input-group>
          </b-form-group>
        </b-card-body>
        <b-card-body v-else-if="page==='manage-sub'">
          <b-card-title class="domain">
            <h4>{{ domain }}</h4>
          </b-card-title>
          <b-card-sub-title class="mb-2" />
          <b-card-text class="owner">
            <b-alert show variant="secondary">
              <h5>Owner</h5>
              <a :href="'https://etherscan.io/address/'+domainOwner" rel="noreferrer noopener" target="_blank">
                {{ domainOwner }}
              </a>
            </b-alert>
          </b-card-text>
          <b-form-group
            v-for="(info, index) in domainInfos"
            :key="index"
            :label="info.label"
            :label-for="info.id"
          >
            <b-form-input
              :id="info.id"
              v-model="domainInfos[index].model"
              type="text"
            />
          </b-form-group>
        </b-card-body>
        <b-card-body v-else-if="page==='create-sub'">
          <b-card-title class="domain">
            <h4>{{ domain }}</h4>
          </b-card-title>
          <b-card-sub-title class="mb-2" />
          <b-card-text class="owner">
            <b-alert show variant="secondary">
              <h5>Owner</h5>
              <a :href="'https://etherscan.io/address/'+domainOwner" rel="noreferrer noopener" target="_blank">
                {{ domainOwner }}
              </a>
            </b-alert>
          </b-card-text>
          <b-alert show variant="primary">
            <p>This Subdomain does not exist. Would you like to create it?</p>
            <b-button :show="!waiting" variant="primary" size="sm" @click="createSubDomain">
              Create
            </b-button>
            <b-progress :show="waiting" :value="100" variant="default" :striped="striped" class="mt-2" />
          </b-alert>
        </b-card-body>
        <div class="d-flex justify-content-end button-div">
          <b-button v-show="page!=='create-sub'" variant="primary" @click="enterDomain">
            Submit
          </b-button>
        </div>
      </b-card>
    </div>
    <footer>
      <a title="GitHub" class="mx-sm-2" href="https://github.com/uniibu/subcrypto-dapp">
        <svg
          height="20"
          class="octicon octicon-mark-github"
          viewBox="0 0 16 16"
          version="1.1"
          width="20"
          aria-hidden="true"
        ><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
      </a>
      <a title="Unstoppable" class="mx-sm-2" href="http://cantstopme.crypto">
        <span><b-img src="~/assets/ud/ud-icon.png" fluid style="height:20px;width:20px;" /></span>
      </a>
      <a title="IPFS" class="mx-sm-2" href="https://gateway.ipfs.io/ipfs/">
        <span><b-img src="~/assets/images/ipfs.png" fluid style="height:20px;width:20px;" /></span>
      </a>
      <hr>
      <p class="trademark">
        All product names, logos, brands, libraries, company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
      </p>
    </footer>
    <div class="signature">
      Coded with <span class="heart">❤</span> by
      <a class="authorname" href="https://github.com/uniibu">Unibtc</a>
    </div>
  </div>
</template>

<script>
import Resolution from '@unstoppabledomains/resolution'
import { ethers } from 'ethers'
import { cryptoContract } from 'Mixins'
import consola from 'consola'
const resolution = new Resolution({
  blockchain: {
    ens: {
      url: 'https://mainnet.infura.io/v3/350101a50e4c4319bcafc44313daf5dc'
    },
    cns: {
      url: 'https://mainnet.infura.io/v3/350101a50e4c4319bcafc44313daf5dc'
    }
  }
})
export default {
  mixins: [cryptoContract],
  data () {
    return {
      waiting: false,
      tokenId: '',
      mainDomain: '',
      createSub: false,
      enabled: false,
      domain: '',
      subDomain: '',
      domainOwner: '',
      state: null,
      alertmessage: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      ipfs: '',
      page: 'start',
      htmlUrl: '',
      domainInfos: [],
      currencies: ['BTC', 'ETH', 'ZIL', 'LTC']
    }
  },
  mounted () {
    const disclaimer = parseInt(window.localStorage.getItem('disclaimer') || 0)
    if (!disclaimer) {
      this.$bvModal.show('disclaimer')
    } else {
      this.enabled = true
    }
    consola.log(this.page)
    if (window.location.hash) {
      const domain = window.location.hash.substr(1)
      if (!this.isSubDomain(domain)) {
        this.page = 'manage'
        this.domain = domain
        this.mainDomain = domain
        this.enterDomain()
      } else {
        this.page = 'manage-sub'
        const parts = domain.split('.')
        this.subDomain = parts.shift()
        this.domain = parts.join('.')
        this.mainDomain = this.domain
        this.enterSubDomain()
      }
    }
  },
  methods: {
    async updateDomainInfos () {
      consola.log(this.domainInfos)
      const keys = []
      const values = []
      for (const i of this.domainInfos) {
        keys.push(this.nsKeys[i.key])
        if (i.model === null) {
          i.model = ''
        }
        values.push(i.model)
      }

      const wallet = await this.connectWeb3()
      const registryContract = new ethers.Contract(
        this.registryContract,
        this.registryAbi,
        wallet.signer.provider
      )
      consola.log(this.domain)
      const tokenId = ethers.utils.namehash(this.domain)

      const currentResolverAddress = await registryContract.resolverOf(tokenId).catch(() => {})
      const resolverContract = new ethers.Contract(
        currentResolverAddress || '0xEf31d4Eb54A743a6d665D067A374cD64CBD71ee3',
        this.resolverAbi,
        wallet.signer.provider
      )
      const superRegistryContract = registryContract.connect(wallet.signer)
      if (!currentResolverAddress) {
        await superRegistryContract.resolveTo(
          resolverContract.address,
          tokenId
        )
      }
      const superResolverContract = resolverContract.connect(wallet.signer)
      superResolverContract.once('Set', () => {
        consola.log('Set')
        window.location.reload()
      })
      superRegistryContract.once('Sync', () => {
        consola.log('Sync')
        window.location.reload()
      })
      await superResolverContract.setMany(keys, values, tokenId)
      this.showAlert('Please wait for transaction to confirm')
    },
    async createSubDomain () {
      this.waiting = true
      const wallet = await this.connectWeb3()
      const registryContract = new ethers.Contract(
        this.registryContract,
        this.registryAbi,
        wallet.signer.provider
      )
      const superRegistryContract = registryContract.connect(wallet.signer)
      superRegistryContract.once('NewURI', (tokenId, newAddress) => {
        consola.log(tokenId, newAddress)
        if (this.domain === newAddress) {
          this.toHash()
          this.waiting = false
          window.location.reload()
        }
      })
      const sub = this.domain.split('.').shift()
      superRegistryContract.functions.safeMintChild(wallet.address, this.tokenId, sub)
    },
    acceptDisclaimer () {
      window.localStorage.setItem('disclaimer', 1)
      this.enabled = true
      window.location.reload()
    },
    cancelDisclaimer () {
      window.localStorage.setItem('disclaimer', 0)
      this.enabled = false
      window.location.href = 'https://unstoppabledomains.com/r/f6b655c935b54db'
    },
    toHome () {
      window.location.hash = ''
      this.state = null
      this.domain = ''
      this.subDomain = ''
      this.domainOwner = ''
      this.alertmessage = ''
      this.page = 'start'
      this.ipfs = ''
      this.htmlUrl = ''
      this.createSub = false
      this.domainInfos = []
      this.tokenId = ''
      this.mainDomain = ''
    },
    toHash () {
      window.location.hash = '#' + this.domain
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert (message) {
      this.dismissCountDown = this.dismissSecs
      this.alertmessage = message
    },
    validate () {
      if (this.domain) {
        this.state = null
      }
    },
    isUndefined (v) {
      return typeof v === 'undefined'
    },
    prepareDomain (domain) {
      domain = domain.trim()
      if (!domain) { return null }
      const tld = domain.trim().split('.').pop()
      if (tld !== 'crypto') {
        domain += '.crypto'
      }
      return domain
    },
    isSubDomain (domain) {
      return domain.split('.').length > 2
    },
    async resolutionAsync (method, ...args) {
      try {
        consola.log(method, ...args)
        return await resolution[method](...args)
      } catch (e) {
        return ''
      }
    },
    async showDetails () {
      for (const curr of this.currencies) {
        this.domainInfos.push({
          label: curr + ' Address',
          key: curr,
          model: await this.resolutionAsync('address', this.domain, curr),
          id: curr + 'input'
        })
      }
      this.domainInfos.push({
        label: 'IPFS HASH',
        key: 'html',
        model: await this.resolutionAsync('ipfsHash', this.domain),
        id: 'ipfshash'
      })
      this.domainInfos.push({
        label: 'IPFS URL',
        key: 'redirect_domain',
        model: await this.resolutionAsync('httpUrl', this.domain),
        id: 'ipfshttp'
      })
      consola.info('domaininfos', this.domainInfos)
    },
    async enterSubDomain () {
      let subDomain = this.subDomain + '.' + this.domain
      subDomain = this.prepareDomain(subDomain)
      if (!subDomain) {
        this.state = false
        return
      }
      this.domainOwner = await this.resolutionAsync('owner', subDomain)
      consola.log(this.domainOwner)
      if (this.domainOwner && this.domainOwner !== '0x0000000000000000000000000000000000000000') {
        this.domain = subDomain
        this.page = 'manage-sub'
        this.toHash()
        this.showDetails()
      } else {
        if (this.domainOwner === '0x0000000000000000000000000000000000000000') {
          this.domainOwner = 'This domain is not registered'
        }
        if (this.mainDomain !== this.domain) {
          throw new Error('Invalid Domain')
        }
        this.tokenId = ethers.utils.namehash(this.mainDomain)
        this.domain = subDomain
        this.page = 'create-sub'
      }
    },
    async connectWeb3 () {
      const _win = window
      if (this.isUndefined(_win.ethereum) && (this.isUndefined(_win.web3) || this.isUndefined(_win.web3.currentProvider))) {
        return this.showAlert('Please Install or Enable your Metamask Wallet')
      }
      const provider = _win.ethereum || _win.web3.currentProvider
      if (_win.ethereum) {
        await provider.enable()
      }
      const web3Provider = new ethers.providers.Web3Provider(provider)
      const signer = await web3Provider.getSigner()
      const { chainId } = await web3Provider.getNetwork()
      if (chainId !== 1) {
        return this.showAlert('Only works with Ethereum Mainnet')
      }
      const address = await signer.getAddress()
      return {
        signer, address, chainId: '0x' + chainId.toString(16)
      }
    },
    backToDomain () {
      this.subDomain = ''
      const parts = this.domain.split('.')
      if (this.page === 'manage') {
        return this.toHome()
      }
      parts.shift()
      this.domain = parts.join('.')
      this.enterDomain()
    },
    async enterDomain () {
      if (!this.enabled) {
        return this.$bvModal.show('disclaimer')
      }
      if (this.page === 'manage-sub') {
        await this.updateDomainInfos()
      } else {
        await this._enterDomain()
      }
    },
    async _enterDomain () {
      if (this.subDomain) {
        return this.enterSubDomain()
      }
      const domain = this.prepareDomain(this.domain)
      if (!domain) {
        this.state = false
      }
      this.domainOwner = await this.resolutionAsync('owner', domain)

      consola.log(this.domainOwner)
      if (this.domainOwner && this.domainOwner !== '0x0000000000000000000000000000000000000000') {
        this.domain = domain
        this.page = 'manage'
        this.toHash()
      } else {
        this.showAlert('This domain does not exist!')
      }
    }
  }
}
</script>
