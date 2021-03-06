import React from 'react';
import AltContainer from 'alt-container';

import styles from './css/media.module.css';

import InfoBox from './components/InfoBox';
import AlbumCover from './components/AlbumCover';
import PlayList from './components/PlayList';
import PWYW from './components/PWYW';

import testData from './tests/data.json';

import alt from './alt';
import utils from './utils';

import Store, {Actions} from './stores/LibrarydStore';
import BTCStore, {Actions as BTCActions} from './stores/BitcoinStore';

export default class Component extends React.Component {
    static defaultProps = {
        txid: 'fc9220025df5f2bf76fcda8f66bced4c95846e136ff3f5ff4c36fede3a5e3fc5'
    }

    constructor(props) {
        super(props);

        this.state = {
            txid: location.hash?location.hash.replace('#', ''):this.props.txid
        }

        location.hash = this.state.txid;
        Store.fetchTXID(this.state.txid);
        BTCStore.fetchBTCAverage();
    }

    render() {

        return (
            <AltContainer stores={{state: Store, btc: BTCStore}}
                          actions={Actions}
                          render={props => {
                                  if (Store.isLoading()) {
                                      return <p>Loading Please Wait...</p>
                                  }

                                  if (props.state.failed){
                                      return (
                                          <div>
                                              <h1>txid: {this.state.txid}</h1>
                                 {props.state.failed}
                                          </div>
                                      )
                                  }

                                  return <Alexandria {...props}/>
                              }}
            />
        )
    }
}

export class Alexandria extends React.Component {
    render() {
        let {state, PWYWActions} = this.props;
        console.log (this.props, this.state)

            return (
                <div className={styles.main}>
                    {state.PWYW.shown?
                     <PWYW {...state.PWYW} actions={PWYWActions} />:null
                    }
                     <div className={styles.container}>
                         <div className={styles.top}>
                             <InfoBox {...this.props} />
                             <AlbumCover {...state}/>
                         </div>
                         <div className={styles.bottom}>
                             <PlayList tracks={state.tracks} author={state.mediaInfo.artist}/>
                         </div>
                     </div>
                </div>
            )
    }
}


