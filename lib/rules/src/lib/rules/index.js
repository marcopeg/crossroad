import originNotNull from './origin-not-null'
import originWhiteList from './origin-white-list'

const rulesFn = {
    originNotNull,
    originWhiteList,
}

export default async (rules, meta, graphql) => {
    if (!rules) {
        return
    }

    for (const rule of rules) {
        if (!rulesFn[rule.name]) {
            throw new Error(`Unknown rule "${rule.name}"`)
        }

        await rulesFn[rule.name](rule, meta, graphql)
    }
}
