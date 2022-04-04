import { defineComponent, type ComponentOptions } from "vue"

export default class VueBase {
  static buildSteps = ['LifecycleHooks', 'Methods', 'Data', 'Computed', 'Watchers']
  static lifecycleHooks = [ 'created', 'mounted' ]

  _buildLifecycleHooks(): ComponentOptions {
    const opts = {}
    VueBase.lifecycleHooks.forEach(hook => {
      if (this[hook]) {
        opts[hook] = this[hook]
      }
    })
    return opts
  }

  get _descriptors() {
    return Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype))
  }

  _buildMethods(): ComponentOptions {
    const opts = {
      methods: {}
    }
    this._descriptors.forEach(([key, descriptor]) => {
      if (key !== 'constructor' && descriptor.value && typeof descriptor.value === 'function') {
        opts.methods[key] = descriptor.value
      }
    })
    return opts
  }

  _buildComputed(): ComponentOptions {
    const opts = {
      computed: {}
    }
    this._descriptors.forEach(([key, descriptor]) => {
      if (key !== 'constructor' && descriptor.get && typeof descriptor.get === 'function') {
        opts.computed[key] = descriptor.get
      }
    })
    return opts
  }

  _buildData(): ComponentOptions {
    const opts = {}
    let data = {}
    Object.getOwnPropertyNames(this).map(variableName => {
      data[variableName] = this[variableName]
    })
    opts.data = () => ({...data})
    return opts
  }

  _buildWatchers(): ComponentOptions {
    let opts = {}
    let data = {}
    for (let key of Object.keys(this._watchers)) {
      opts = { ...opts, watch: { ...opts.watch, [key]: this._watchers[key] } }
    }
    return opts
  }

  toComponent(extras: ComponentOptions = {}) {
    let opts: ComponentOptions = extras
    for(let step of VueBase.buildSteps) {
      opts = { ...opts, ...this['_build' + step]() }
    }
    return defineComponent(opts)
  }
}