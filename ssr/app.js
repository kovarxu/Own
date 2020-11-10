import App from './App.vue'
import Vue from 'vue'

new Vue({
  render: (h) => h(App),
}).$mount('#app')

var a = {
  retcode: 0,
  result: {
    isShow: true,
    auto_match: false,
    refresh_freq: 5,
    refresh_freq_mobile: 5,
    actId: 144028022,
    time: 1604630999,
    phaseExt: 'all_cycle',
    phase_stage: 'race',
    phase: 'all_cycle',
    combine_rank_list: {
      1025: {
        ext_json: {
          anchor_name: '关口子w',
          competition_end_time: 1605456000,
          pk_score: '0',
          track: 'south',
          day_round: 1,
          anchor_pic:
            'https://nowpic.gtimg.com/hy_personal/c56cfb8c2131af70745a88177a0152020253f9ea8f1ae3d4284e51371189e3d6/',
          stage: 2,
          day_count: 25,
          win_num: null,
          schedule: {
            phase: 2,
            name: '14进7',
            type: 'pk',
            start: 1604630700000,
            end: 1604632200000,
            balanceStart: 1604632200000,
          },
          is_in_competition: true,
          lose_num: '1',
          pk_status: '0',
          pk_anchor_name: '土豆小丸子',
          end_time: '1604630970061',
          anchor_score: '0',
          seq: '1092',
          start_time: '1604630700061',
          eliminated: false,
          cts: 1604630999082,
          action_end_time: 1605456000,
          pk_anchor_pic:
            'https://nowpic.gtimg.com/hy_personal/5253d6b3ee9d5d00b32c93fa9627c2309fa58bca46ddc13d1866c4d34fd09ae4/',
        },
        rank_group_list: [],
        rank_list: [],
        rank_total: 0,
        group_list: [],
        lock: '',
        rank_name: '比赛挂件详情',
        objId: '',
        rankId: 1025,
        rank_my: { rank: 0, score: 0, member_id: '3501511360' },
      },
    },
    batch_task_list: {},
    load_cache_time_in_mills: 1604630999387,
    _s_addr: 1604280676,
  },
}
