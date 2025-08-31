import {
  SimplePool,
  finalizeEvent,
  verifyEvent,
  getPublicKey,
  generateSecretKey,
  nip19,
  nip44,
} from "nostr-tools";

export type NostrTag = string[];
export type NostrEvent = {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: NostrTag[];
  content: string;
  sig: string;
};

export type GiftWrapEvent = NostrEvent; // kind 1059
export type SealEvent = NostrEvent; // kind 13
export type Rumor = {
  pubkey: string; // sender's long-term identity pubkey (hex)
  created_at: number;
  kind: number; // 14
  tags: NostrTag[];
  content: string; // BitChat payload typically "bitchat1:<base64url>"
};

export type ChannelEvent = NostrEvent; // kind 20000

export type ChannelMessage = {
  event: ChannelEvent;
  geohash?: string;
  nickname?: string;
  teleported?: boolean;
  content: string;
};

export type DMMessage = {
  gift: GiftWrapEvent;
  content: string;
  senderPubkey: string; // long-term identity of sender (from rumor.pubkey)
  timestamp: number;
};

export const defaultRelays = [
  "wss://relay.damus.io",
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.mom",
  "wss://nostr.slothy.win",
  "wss://nostr.einundzwanzig.space",
  "wss://nos.lol",
  "wss://relay.nostr.band",
  "wss://no.str.cr",
  "wss://nostr.massmux.com",
  "wss://nostr-relay.schnitzel.world",
  "wss://relay.nostr.com.au",
  "wss://knostr.neutrine.com",
  "wss://nostr.nodeofsven.com",
  "wss://nostr.vulpem.com",
  "wss://nostr-verif.slothy.win",
  "wss://relay.lexingtonbitcoin.org",
  "wss://nostr-1.nbo.angani.co",
  "wss://relay.wellorder.net",
  "wss://nostr.easydns.ca",
  "wss://relay.dwadziesciajeden.pl",
  "wss://nostr.data.haus",
  "wss://nostr.einundzwanzig.space",
  "wss://nostr.mom",
  "wss://nos.lol",
  "wss://relay.nostr.band",
  "wss://nostr.massmux.com",
  "wss://nostr.vulpem.com",
  "wss://relay.damus.io",
  "wss://nostr-pub.wellorder.net",
  "wss://no.str.cr",
  "wss://relay.dwadziesciajeden.pl",
  "wss://nostr.data.haus",
  "wss://relay.wellorder.net",
  "wss://relay.nostromo.social",
  "wss://offchain.pub",
  "wss://relay.nostr.wirednet.jp",
  "wss://relay.nostrcheck.me",
  "wss://nostrue.com",
  "wss://nostr-relay.schnitzel.world",
  "wss://nproxy.kristapsk.lv",
  "wss://nostr.spaceshell.xyz",
  "wss://nostr-dev.wellorder.net",
  "wss://nostr-verified.wellorder.net",
  "wss://nostr.roundrockbitcoiners.com",
  "wss://slick.mjex.me",
  "wss://nostr.yael.at",
  "wss://relay.primal.net",
  "wss://nostr.oxtr.dev",
  "wss://nostr.21crypto.ch",
  "wss://nostr.liberty.fans",
  "wss://nostr-02.dorafactory.org",
  "wss://relay.hodl.ar",
  "wss://nostr.middling.mydns.jp",
  "wss://nostr.namek.link",
  "wss://nostrja-kari.heguro.com",
  "wss://nostr.hifish.org",
  "wss://nostr.rikmeijer.nl",
  "wss://black.nostrcity.club",
  "wss://nostr.hekster.org",
  "wss://relay.wavlake.com",
  "wss://nostr.sagaciousd.com",
  "wss://nostr.fbxl.net",
  "wss://ithurtswhenip.ee",
  "wss://relay2.nostrchat.io",
  "wss://relay1.nostrchat.io",
  "wss://nostr-01.yakihonne.com",
  "wss://nostr.sathoarder.com",
  "wss://nostr.overmind.lol",
  "wss://relay.verified-nostr.com",
  "wss://purplerelay.com",
  "wss://relay.orangepill.ovh",
  "wss://nostr-relay.psfoundation.info",
  "wss://soloco.nl",
  "wss://relay.froth.zone",
  "wss://nostr.stakey.net",
  "wss://nostr.2b9t.xyz",
  "wss://pyramid.fiatjaf.com",
  "wss://a.nos.lol",
  "wss://relay.magiccity.live",
  "wss://nostr.notribe.net",
  "wss://freelay.sovbit.host",
  "wss://relay.credenso.cafe",
  "wss://nostr.huszonegy.world",
  "wss://multiplexer.huszonegy.world",
  "wss://bucket.coracle.social",
  "wss://nostr.kungfu-g.rip",
  "wss://relay.artx.market",
  "wss://relay.notoshi.win",
  "wss://vitor.nostr1.com",
  "wss://nostr-02.yakihonne.com",
  "wss://nostr-03.dorafactory.org",
  "wss://n.ok0.org",
  "wss://nostr.0x7e.xyz",
  "wss://relay.nostr.net",
  "wss://strfry.openhoofd.nl",
  "wss://relay.fountain.fm",
  "wss://relay.usefusion.ai",
  "wss://relay.varke.eu",
  "wss://nostr.satstralia.com",
  "wss://relay.13room.space",
  "wss://nostr.myshosholoza.co.za",
  "wss://nostr.carroarmato0.be",
  "wss://nostr.dbtc.link",
  "wss://orangepiller.org",
  "wss://adre.su",
  "wss://relay.sincensura.org",
  "wss://relay.freeplace.nl",
  "wss://bostr.bitcointxoko.com",
  "wss://nostr.plantroon.com",
  "wss://srtrelay.c-stellar.net",
  "wss://nostr.jfischer.org",
  "wss://nostr.novacisko.cz",
  "wss://relay.lumina.rocks",
  "wss://nostr.tavux.tech",
  "wss://relay.nostrhub.fr",
  "wss://relay.agorist.space",
  "wss://chorus.pjv.me",
  "wss://relay.cosmicbolt.net",
  "wss://santo.iguanatech.net",
  "wss://relay.tagayasu.xyz",
  "wss://relay.mostro.network",
  "wss://relay.zone667.com",
  "wss://relay5.bitransfer.org",
  "wss://relay.illuminodes.com",
  "wss://relay2.angor.io",
  "wss://relay.satsdays.com",
  "wss://relay.angor.io",
  "wss://orangesync.tech",
  "wss://nostr-relay.cbrx.io",
  "wss://relay.21e6.cz",
  "wss://nostr.chaima.info",
  "wss://relay.satlantis.io",
  "wss://relay.digitalezukunft.cyou",
  "wss://relay.tapestry.ninja",
  "wss://relay.minibolt.info",
  "wss://nostr.bilthon.dev",
  "wss://nostr.makibisskey.work",
  "wss://relay.mattybs.lol",
  "wss://noxir.kpherox.dev",
  "wss://sendit.nosflare.com",
  "wss://relay.coinos.io",
  "wss://relay.nostraddress.com",
  "wss://wot.nostr.party",
  "wss://nostrelites.org",
  "wss://relay.nostriot.com",
  "wss://prl.plus",
  "wss://zap.watch",
  "wss://wot.codingarena.top",
  "wss://nostr.azzamo.net",
  "wss://wot.sudocarlos.com",
  "wss://relay.lnfi.network",
  "wss://wot.nostr.net",
  "wss://relay.nostrdice.com",
  "wss://wot.sebastix.social",
  "wss://wheat.happytavern.co",
  "wss://relay.sigit.io",
  "wss://strfry.bonsai.com",
  "wss://travis-shears-nostr-relay-v2.fly.dev",
  "wss://satsage.xyz",
  "wss://relay.degmods.com",
  "wss://nostr.community.ath.cx",
  "wss://nostr.coincrowd.fund",
  "wss://strfry.shock.network",
  "wss://cyberspace.nostr1.com",
  "wss://relay02.lnfi.network",
  "wss://nostr-rs-relay.dev.fedibtc.com",
  "wss://relay.davidebtc.me",
  "wss://wot.dtonon.com",
  "wss://relay.goodmorningbitcoin.com",
  "wss://articles.layer3.news",
  "wss://bostr.syobon.net",
  "wss://nostr.agentcampfire.com",
  "wss://nostr.thebiglake.org",
  "wss://schnorr.me",
  "wss://relay.wolfcoil.com",
  "wss://nostr.camalolo.com",
  "wss://nostr.tac.lol",
  "wss://dev-relay.lnfi.network",
  "wss://relay.bitcoinveneto.org",
  "wss://nostr.red5d.dev",
  "wss://relay-testnet.k8s.layer3.news",
  "wss://promenade.fiatjaf.com",
  "wss://nostrelay.memory-art.xyz",
  "wss://inbox.azzamo.net",
  "wss://social.proxymana.net",
  "wss://relay.netstr.io",
  "wss://premium.primal.net",
  "wss://nostr.lojong.info",
  "wss://nostr-rs-relay-ishosta.phamthanh.me",
  "wss://relay.stream.labs.h3.se",
  "wss://tollbooth.stens.dev",
  "wss://relay.chakany.systems",
  "wss://relay.mwaters.net",
  "wss://nostr-relay.shirogaku.xyz",
  "wss://kitchen.zap.cooking",
  "wss://relay.arx-ccn.com",
  "wss://relay.fr13nd5.com",
  "wss://nostr.tegila.com.br",
  "wss://relay.jeffg.fyi",
  "wss://relay.bullishbounty.com",
  "wss://nostr.spicyz.io",
  "wss://relay04.lnfi.network",
  "wss://vidono.apps.slidestr.net",
  "wss://relay03.lnfi.network",
  "wss://communities.nos.social",
  "wss://relay.evanverma.com",
  "wss://nostrelay.circum.space",
  "wss://wot.brightbolt.net",
  "wss://relayrs.notoshi.win",
  "wss://fenrir-s.notoshi.win",
  "wss://relay.nsnip.io",
  "wss://x.kojira.io",
  "wss://relay.hasenpfeffr.com",
  "wss://relay01.lnfi.network",
  "wss://nostr.rtvslawenia.com",
  "wss://relay.g1sms.fr",
  "wss://nostr.kalf.org",
  "wss://nostr.rblb.it",
  "wss://nostr.4rs.nl",
  "wss://relay.vrtmrz.net",
  "wss://nostr.hoppe-relay.it.com",
  "wss://relay-rpi.edufeed.org",
  "wss://relay.copylaradio.com",
  "wss://relay.ru.ac.th",
  "wss://relay.bitcoinartclock.com",
  "wss://wot.downisontheup.ca",
  "wss://nostr.coincards.com",
  "wss://relay.etch.social",
  "wss://relay.mess.ch",
  "wss://relay.holzeis.me",
  "wss://relay-admin.thaliyal.com",
  "wss://nostr.thaliyal.com",
  "wss://strfry.felixzieger.de",
  "wss://nostr.smut.cloud",
  "wss://r.bitcoinhold.net",
  "wss://nostr.blankfors.se",
  "wss://portal-relay.pareto.space",
  "wss://relay.getsafebox.app",
  "wss://relay.anzenkodo.workers.dev",
  "wss://relay.nostrhub.tech",
  "wss://nostr.prl.plus",
  "wss://nostr-2.21crypto.ch",
  "wss://nostr.zenon.network",
  "wss://nostr-relay.amethyst.name",
  "wss://relayone.geektank.ai",
  "wss://fanfares.nostr1.com",
  "wss://wot.geektank.ai",
  "wss://relay-dev.satlantis.io",
  "wss://relay.siamdev.cc",
  "wss://relay.nosto.re",
  "wss://wot.soundhsa.com",
  "wss://nostr.n7ekb.net",
  "wss://relayone.soundhsa.com",
  "wss://relay.puresignal.news",
  "wss://relay.nostx.io",
  "wss://nostr.now",
  "wss://relay.artiostr.ch",
  "wss://relay.oldenburg.cool",
  "wss://theoutpost.life",
  "wss://khatru.nostrver.se",
  "wss://relay.wavefunc.live",
  "wss://nostr-relay.zimage.com",
  "wss://relay.javi.space",
  "wss://bostr.shop",
  "wss://relay.letsfo.com",
  "wss://alien.macneilmediagroup.com",
  "wss://rn1.sotiras.org",
  "wss://gnostr.com",
  "wss://relay.conduit.market",
  "wss://relay.hivetalk.org",
  "wss://nostr.l484.com",
  "wss://relay.chorus.community",
  "wss://nostr-relay.moe.gift",
  "wss://relay.nostrcal.com",
  "wss://temp.iris.to",
  "wss://librerelay.aaroniumii.com",
  "wss://nostr-relay-1.trustlessenterprise.com",
  "wss://relay.barine.co",
  "wss://nostr.rohoss.com",
  "wss://wot.nostr.place",
  "wss://relay.utxo.farm",
  "wss://relay.bankless.at",
  "wss://relay.toastr.net",
  "wss://nostr.excentered.com",
  "wss://relay.mccormick.cx",
  "wss://relay.cypherflow.ai",
  "wss://relay.laantungir.net",
  "wss://nostr.veladan.dev",
  "wss://nostr.tadryanom.me",
  "wss://nostr-relay.online",
  "wss://nostr.night7.space",
  "wss://dev-nostr.bityacht.io"
];

// Timestamp (seconds)
const now = () => Math.floor(Date.now() / 1000);

// Tags helpers
function getFirstTagValue(ev: NostrEvent, tagName: string): string | undefined {
  const t = ev.tags.find((t) => t[0] === tagName);
  return t?.[1];
}
function hasTag(ev: NostrEvent, tagName: string, value?: string): boolean {
  return ev.tags.some(
    (t) => t[0] === tagName && (value === undefined || t[1] === value),
  );
}

// npub -> hex
export function npubToHex(npub: string): string {
  const decoded = nip19.decode(npub);
  if (decoded.type !== "npub") throw new Error("not an npub");
  return decoded.data as string;
}

// --- Gift-wrapped DM: build/send ---

// Build an unsigned rumor (kind 14)
function buildRumor(senderPubHex: string, content: string): Rumor {
  return {
    pubkey: senderPubHex,
    created_at: now(),
    kind: 14,
    tags: [],
    content,
  };
}

// Sign an event template with a secret key
async function signEvent<T extends Omit<NostrEvent, "id" | "sig">>(
  template: T,
  sk: Uint8Array,
): Promise<NostrEvent> {
  const pubkey = getPublicKey(sk);
  const unsigned = { ...template, pubkey } as any;
  const event = finalizeEvent(unsigned, sk);
  return event as NostrEvent;
}

// Encrypt plaintext with NIP-44 v2 from ephemeralSk -> recipientHex
async function v2EncryptFromEphemeral(
  plaintext: string,
  recipientHex: string,
  ephemeralSk: Uint8Array,
): Promise<string> {
  // Returns "v2:..." ciphertext
  return nip44.encrypt(
    Buffer.from(ephemeralSk).toString("hex"),
    Buffer.from(recipientHex, "hex"),
    Buffer.from(plaintext)
  );
}

// Decrypt ciphertext with NIP-44 v2 using mySk and senderPubHex
async function v2DecryptWithIdentity(
  ciphertext: string,
  mySk: Uint8Array,
  senderPubHex: string,
): Promise<string> {
  return nip44.decrypt(Buffer.from(mySk).toString("hex"), Buffer.from(ciphertext));
}

/**
 * Send a BitChat-style gift-wrapped DM (NIP-17 + NIP-59) to recipientHex.
 * innerContent is the rumor content. BitChat expects "bitchat1:<base64url>" for full interop.
 */
export async function sendDM(
  pool: SimplePool,
  relays: string[],
  myIdentitySk: Uint8Array,
  recipientHex: string,
  innerContent: string,
): Promise<GiftWrapEvent> {
  // 1) Rumor (unsigned, kind 14)
  const senderPubHex = getPublicKey(myIdentitySk);
  const rumor = buildRumor(senderPubHex, innerContent);
  const rumorJSON = JSON.stringify(rumor);

  // 2) Seal (kind 13) using ephemeral seal key
  const sealSk = generateSecretKey();
  const sealCiphertext = await v2EncryptFromEphemeral(
    rumorJSON,
    recipientHex,
    sealSk,
  );
  const sealTemplate: Omit<NostrEvent, "id" | "sig"> = {
    pubkey: "", // filled by signEvent
    created_at: now(),
    kind: 13,
    tags: [],
    content: sealCiphertext,
  };
  const sealEvent = await signEvent(sealTemplate, sealSk);
  const sealJSON = JSON.stringify(sealEvent);

  // 3) Gift wrap (kind 1059) using new ephemeral wrap key
  const wrapSk = generateSecretKey();
  const wrapCiphertext = await v2EncryptFromEphemeral(
    sealJSON,
    recipientHex,
    wrapSk,
  );
  const giftTemplate: Omit<NostrEvent, "id" | "sig"> = {
    pubkey: "", // filled by signEvent
    created_at: now(),
    kind: 1059,
    tags: [["p", recipientHex]], // important: tag the recipient
    content: wrapCiphertext,
  };
  const giftWrap = await signEvent(giftTemplate, wrapSk);

  // 4) Publish
  const pubs = pool.publish(relays, giftWrap);
  await Promise.allSettled(pubs);
  return giftWrap as GiftWrapEvent;
}

/**
 * Decrypt a received gift wrap to the inner message (rumor).
 * Returns content, sender's identity pubkey, and timestamp.
 */
export async function decryptDM(
  gift: GiftWrapEvent,
  myIdentitySk: Uint8Array,
): Promise<DMMessage> {
  if (gift.kind !== 1059) throw new Error("Not a gift wrap (kind 1059)");

  // 1) Decrypt gift wrap with my identity key + wrap ephemeral pubkey
  const sealJSON = await v2DecryptWithIdentity(
    gift.content,
    myIdentitySk,
    gift.pubkey,
  );

  // 2) Parse and validate sealed event
  const seal = JSON.parse(sealJSON) as SealEvent;
  if (seal.kind !== 13)
    throw new Error("Decrypted payload is not a seal (kind 13)");
  // Optional: verify seal signature (signed by ephemeral)
  if (!verifyEvent(seal)) {
    // Not strictly required for decryption path
    // console.warn('Invalid seal signature')
  }

  // 3) Decrypt seal to rumor using my identity key + seal ephemeral pubkey
  const rumorJSON = await v2DecryptWithIdentity(
    seal.content,
    myIdentitySk,
    seal.pubkey,
  );
  const rumor = JSON.parse(rumorJSON) as Rumor;
  if (rumor.kind !== 14)
    throw new Error("Inner event is not a rumor (kind 14)");

  return {
    gift,
    content: rumor.content,
    senderPubkey: rumor.pubkey,
    timestamp: rumor.created_at,
  };
}

/**
 * Respond to a DM by decrypting the incoming gift, extracting the sender's identity pubkey,
 * and sending a new gift-wrapped DM back.
 */
export async function respondToDM(
  pool: SimplePool,
  relays: string[],
  myIdentitySk: Uint8Array,
  incomingGift: GiftWrapEvent,
  replyContent: string,
): Promise<GiftWrapEvent> {
  const { senderPubkey } = await decryptDM(incomingGift, myIdentitySk);
  return await sendDM(pool, relays, myIdentitySk, senderPubkey, replyContent);
}

// --- Public channel (kind 20000) listen/send ---

/**
 * Publish a geohash-scoped ephemeral public message (kind 20000).
 * Tags:
 *  - ["g", geohash] required
 *  - ["n", nickname] optional
 *  - ["t", "teleport"] optional flag
 */
export async function sendChannelMessage(
  pool: SimplePool,
  relays: string[],
  myIdentitySk: Uint8Array,
  geohash: string,
  content: string,
  opts?: { nickname?: string; teleported?: boolean },
): Promise<ChannelEvent> {
  const tags: NostrTag[] = [["g", geohash]];
  if (opts?.nickname) tags.push(["n", opts.nickname]);
  if (opts?.teleported) tags.push(["t", "teleport"]);

  const template: Omit<NostrEvent, "id" | "sig"> = {
    pubkey: getPublicKey(myIdentitySk),
    created_at: now(),
    kind: 20000,
    tags,
    content,
  };

  const ev = (finalizeEvent(template, myIdentitySk)) as ChannelEvent;
  const pubs = pool.publish(relays, ev);
  await Promise.allSettled(pubs);
  return ev;
}

/**
 * Respond in the same public channel (extracts geohash from the incoming event).
 */
export async function respondToChannelEvent(
  pool: SimplePool,
  relays: string[],
  myIdentitySk: Uint8Array,
  incoming: ChannelEvent,
  replyContent: string,
  opts?: { nickname?: string; teleported?: boolean },
): Promise<ChannelEvent> {
  if (incoming.kind !== 20000)
    throw new Error("Not a channel event (kind 20000)");
  const geohash = getFirstTagValue(incoming, "g");
  if (!geohash) throw new Error("Incoming channel event has no geohash tag");
  return await sendChannelMessage(
    pool,
    relays,
    myIdentitySk,
    geohash,
    replyContent,
    opts,
  );
}

// --- Subscriptions ---

export type DMListenerOptions = {
  sinceSeconds?: number; // look back window; default 24h
};

export type ChannelListenerOptions = {
  sinceSeconds?: number; // look back window; default 1h
  allChannels?: boolean; // if false and geohashes provided, you can narrow later
};

/**
 * Listen for all DMs (gift wraps kind 1059) addressed to me (#p includes my pubkey).
 * onMessage is invoked with decrypted content.
 * Returns an unsubscribe function.
 */
export function listenToDMs(
  pool: SimplePool,
  relays: string[],
  myIdentitySk: Uint8Array,
  onMessage: (msg: DMMessage) => void,
  opts?: DMListenerOptions,
): () => void {
  const myPubHex = getPublicKey(myIdentitySk);
  const since = now() - (opts?.sinceSeconds ?? 60 * 60 * 24); // 24h default

  const sub = pool.subscribeMany(
    relays,
    [{ kinds: [1059], "#p": [myPubHex], since }],
    {
      onevent: async (ev: NostrEvent) => {
        try {
          const gift = ev as GiftWrapEvent;
          const dm = await decryptDM(gift, myIdentitySk);
          onMessage(dm);
        } catch {
          // Ignore decrypt/parse errors
        }
      },
    },
  );

  return () => sub.close();
}

/**
 * Listen to public channel messages (kind 20000).
 * If you want "any channel", this subscribes without limiting #g.
 * Returns an unsubscribe function.
 */
export function listenToAllChannels(
  pool: SimplePool,
  relays: string[],
  onMessage: (msg: ChannelMessage) => void,
  opts?: ChannelListenerOptions,
): () => void {
  const since = now() - (opts?.sinceSeconds ?? 60 * 60); // 1h default
  const filters = [{ kinds: [20000], since }];
  const sub = pool.subscribeMany(relays, filters, {
    onevent: (ev: NostrEvent) => {
      if (ev.kind !== 20000) return;
      const geohash = getFirstTagValue(ev, "g");
      const nickname = getFirstTagValue(ev, "n");
      const teleported = hasTag(ev, "t", "teleport");
      onMessage({
        event: ev as ChannelEvent,
        geohash,
        nickname,
        teleported,
        content: ev.content,
      });
    },
  });
  return () => sub.close();
}

// --- Convenience: create a client wrapper ---

export type BitchatNostrClient = {
  pool: SimplePool;
  relays: string[];
  listenToDMs: (
    mySk: Uint8Array,
    onMessage: (msg: DMMessage) => void,
    opts?: DMListenerOptions,
  ) => () => void;
  listenToAllChannels: (
    onMessage: (msg: ChannelMessage) => void,
    opts?: ChannelListenerOptions,
  ) => () => void;
  sendDM: (
    mySk: Uint8Array,
    recipientHex: string,
    innerContent: string,
  ) => Promise<GiftWrapEvent>;
  respondToDM: (
    incomingGift: GiftWrapEvent,
    mySk: Uint8Array,
    replyContent: string,
  ) => Promise<GiftWrapEvent>;
  sendChannelMessage: (
    mySk: Uint8Array,
    geohash: string,
    content: string,
    opts?: { nickname?: string; teleported?: boolean },
  ) => Promise<ChannelEvent>;
  respondToChannelEvent: (
    incoming: ChannelEvent,
    mySk: Uint8Array,
    replyContent: string,
    opts?: { nickname?: string; teleported?: boolean },
  ) => Promise<ChannelEvent>;
};

/**
 * Create a reusable client with a SimplePool and relay list.
 */
export function createBitchatNostrClient(
  relays: string[] = defaultRelays,
): BitchatNostrClient {
  const pool = new SimplePool();
  return {
    pool,
    relays,
    listenToDMs: (mySk, onMessage, opts) =>
      listenToDMs(pool, relays, mySk, onMessage, opts),
    listenToAllChannels: (onMessage, opts) =>
      listenToAllChannels(pool, relays, onMessage, opts),
    sendDM: (mySk, recipientHex, innerContent) =>
      sendDM(pool, relays, mySk, recipientHex, innerContent),
    respondToDM: (incomingGift, mySk, replyContent) =>
      respondToDM(pool, relays, mySk, incomingGift, replyContent),
    sendChannelMessage: (mySk, geohash, content, opts) =>
      sendChannelMessage(pool, relays, mySk, geohash, content, opts),
    respondToChannelEvent: (incoming, mySk, replyContent, opts) =>
      respondToChannelEvent(pool, relays, mySk, incoming, replyContent, opts),
  };
}

// Example usage (uncomment to test):
// const client = createBitchatNostrClient()
// const mySk = generateSecretKey()
// const unsubDMs = client.listenToDMs(mySk, (dm) => {
//   console.log('DM from', dm.senderPubkey, 'content:', dm.content)
//   // auto-reply
//   client.respondToDM(dm.gift, mySk, 'bitchat1:REPLY_BASE64URL...').catch(console.error)
// })
// const unsubChannels = client.listenToAllChannels((msg) => {
//   console.log('Channel', msg.geohash, 'nick', msg.nickname, 'content:', msg.content)
//   // auto-reply in same channel
//   client.respondToChannelEvent(msg.event, mySk, 'Hello channel!').catch(console.error)
// })
