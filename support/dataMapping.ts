const today = new Date();
const year = today.getFullYear();

const dataSearch: any = {
  ASCSALE1: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY38",
      dataItem: { name: "IDESTA_EXT" }
    },
    {
      dataSection: "ZYTL",
      dataItem: { name: "CODTRA_EXT" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    },
    {
      dataSection: "ZY1S",
      dataItem: { name: "CGSTAT_EXT" }
    },
    {
      dataSection: "ZY1S",
      dataItem: { name: "STEMPL_EXT" }
    },
    {
      dataSection: "ZYCA",
      dataItem: { name: "CLASSI_EXT" }
    },
    {
      dataSection: "ZYCA",
      dataItem: { name: "QUALIF_EXT" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DATAN1", type: "date" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEYE" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEMO" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEDA" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "NATCON_EXT" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "TYPCON_EXT" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "DATCON", type: "date" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "DATFIN", type: "date" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "DURANN" }
    },
    {
      dataSection: "ZYCO",
      dataItem: { name: "DURMOI" }
    },
    {
      dataSection: "ZY35",
      dataItem: { name: "DTEF00", type: "date" }
    },
    {
      dataSection: "ZY35",
      dataItem: { name: "IDPS00_EXT" }
    },
    {
      dataSection: "ZY35",
      dataItem: { name: "IDJB00_EXT" }
    },
    {
      dataSection: "ZY35",
      dataItem: { name: "RTASSI" }
    }
  ],
  ASW0ESE0: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    }
  ],
  ASW018E0: [
    {
      dataSection: "ZY07",
      dataItem: { name: "QUALIT_EXT" }
    },
    {
      dataSection: "ZY07",
      dataItem: { name: "NOMUSE" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENOM" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENO2" }
    },
    {
      dataSection: "ZY05",
      dataItem: { name: "NOMPAT" }
    }
  ],
  ASCSALE0: [
    {
      dataSection: "ZY10",
      dataItem: { name: "DATNAI", type: "date" }
    },
    {
      dataSection: "ZY10",
      dataItem: { name: "VILNAI" }
    },
    {
      dataSection: "ZY10",
      dataItem: { name: "PAYNAI_EXT" }
    },
    {
      dataSection: "ZY18",
      dataItem: { name: "SITFAM_EXT" }
    },
    {
      dataSection: "ZY18",
      dataItem: { name: "DATSIT", type: "date" }
    },
    {
      dataSection: "ZY0H",
      dataItem: { name: "NUMTEL" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    },
    {
      dataSection: "ZY0G",
      dataItem: { name: "ZONADA" }
    },
    {
      dataSection: "ZY0G",
      dataItem: { name: "ZONADB" }
    },
    {
      dataSection: "ZY0G",
      dataItem: { name: "ZONADC" }
    },
    {
      dataSection: "ZY0G",
      dataItem: { name: "ZONADD" }
    },
    {
      dataSection: "ZY0G",
      dataItem: { name: "CDPAYS_EXT" }
    }
  ],
  ASW0AGE0: [
    {
      dataSection: "ZY07",
      dataItem: { name: "QUALIT_EXT" }
    },
    {
      dataSection: "ZY07",
      dataItem: { name: "NOMUSE" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENOM" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENO2" }
    },
    {
      dataSection: "ZY05",
      dataItem: { name: "NOMPAT" }
    }
  ],
  ASW0AGE1: [
    {
      dataSection: "ZY07",
      dataItem: { name: "QUALIT_EXT" }
    },
    {
      dataSection: "ZY07",
      dataItem: { name: "NOMUSE" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENOM" }
    },
    {
      dataSection: "ZY06",
      dataItem: { name: "PRENO2" }
    },
    {
      dataSection: "ZY05",
      dataItem: { name: "NOMPAT" }
    }
  ],
  AIW400E1: [
    {
      dataSection: "ZB01",
      dataItem: { name: "LBSRSH" }
    },
    {
      dataSection: "ZB00",
      dataItem: { name: "IDSR00" }
    },
    {
      dataSection: "ZB1E",
      dataItem: { name: "IDSCNM" }
    },
    {
      dataSection: "ZB1E",
      dataItem: { name: "TXSECT" }
    },
    {
      dataSection: "ZB1A",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZB1A",
      dataItem: { name: "NBPHON" }
    },
    {
      dataSection: "ZB1A",
      dataItem: { name: "TXEMAI" }
    },
    {
      dataSection: "ZB1A",
      dataItem: { name: "DTOPEN" }
    },
    {
      dataSection: "ZB1A",
      dataItem: { name: "DTFILL" }
    },
    {
      dataSection: "ZY2A",
      dataItem: { name: "IDSOAP" }
    },
    {
      dataSection: "ZY2A",
      dataItem: { name: "IDSOAP_EXT" }
    },
    {
      dataSection: "ZB00",
      dataItem: { name: "IDCY00_EXT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDOU00_EXT" }
    },
    {
      dataSection: "ZB0E",
      dataItem: { name: "IDESTA_EXT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDJB00_EXT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDPS00_EXT" }
    },
    {
      dataSection: "ZB00",
      dataItem: { name: "FLSREX_EXT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "DTFRST" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "DTFREN" }
    }
  ],
  ASW00FE0: [
    {
      dataSection: "Z5A0",
      dataItem: { name: "TELFAX" }
    },
    {
      dataSection: "Z5A0",
      dataItem: { name: "TELCEL" }
    },
    {
      dataSection: "Z5A0",
      dataItem: { name: "TELHOM" }
    },
    {
      dataSection: "Z5A0",
      dataItem: { name: "EMAILS" }
    }
  ],
  ATC04AE0: [
    {
      dataSection: "ZY4A",
      dataItem: { name: "LBCLSH" }
    },
    {
      dataSection: "ZY4A",
      dataItem: { name: "NBHOUR" }
    },
    {
      dataSection: "ZY4A",
      dataItem: { name: "DTEFCL" }
    },
    {
      dataSection: "ZY4A",
      dataItem: { name: "DTENCL" }
    },
    {
      dataSection: "ZY4A",
      dataItem: { name: "VARATE" }
    },
    {
      dataSection: "ZY4A",
      dataItem: { name: "FLPAFA_EXT" }
    }
  ],
  ARD0NJE0: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    }
  ],
  ASW03DE0: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    }
  ],
  ASCSALE2: [
    {
      dataSection: "ZY3D",
      dataItem: { name: "LVREQX_EXT" }
    },
    {
      dataSection: "ZY3D",
      dataItem: { name: "LVPROF_EXT" }
    },
    {
      dataSection: "ZY3D",
      dataItem: { name: "IDSK00_EXT" }
    }
  ],
  ATW0RHE1: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    },
    {
      dataSection: "ZY10",
      dataItem: { name: "DATNAI" }
    },
    {
      dataSection: "ZY10",
      dataItem: { name: "AGEAJO" }
    },
    {
      dataSection: "ZY10",
      dataItem: { name: "AGEMJO" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DATAN1" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEYE" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEMO" }
    },
    {
      dataSection: "ZY19",
      dataItem: { name: "DUSEDA" }
    }
  ],
  AIW41VM1: [
    {
      dataSection: "ZB01",
      dataItem: { name: "LBSRSH" }
    },
    {
      dataSection: "ZB00",
      dataItem: { name: "IDSR00" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDOU00" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDOU00_EXT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "DTFRST" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "NBRQFT" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "NBRQIN" }
    },
    {
      dataSection: "ZB1V",
      dataItem: { name: "NBRHFT" }
    },
    {
      dataSection: "ZB1V",
      dataItem: { name: "NBRHIN" }
    },
    {
      dataSection: "ZB1V",
      dataItem: { name: "NBHRFT" }
    },
    {
      dataSection: "ZB1V",
      dataItem: { name: "NBHRIN" }
    }
  ],
  ASW03OP0: [
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOAL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOMS" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGMCO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSKRW" }
    },
    {
      dataSection: "Z5T0",
      dataItem: { name: "TXCOMM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "BLOB01", type: "blob" }
    }
  ],
  ASW03OP3: [
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOAL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSKRW" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOMS" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOST" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGORT" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMPRC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "BLOB01", type: "blob" }
    },
    {
      dataSection: "Z5T0",
      dataItem: { name: "TXCOMM" }
    }
  ],
  ASW03OP1: [
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOAL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOMS" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "DTTARG", type: "date" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "RTWGHT" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "TXOBSH" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "TXOBLG" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "FLPROB_EXT" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "TXMESR" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMDRW" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "STCOMP" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMVCO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSCRT" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLGL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLDEVP" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLCOPR" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMBWI" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSLAP" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNSC_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRGL_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRGL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLTKEV" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSCTK" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLTK" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLOWPO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLPFCR" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLSC" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLQUES" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "STROBJ" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TXCOMM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNEM_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRFN_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRFN" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXEMCM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXRWCM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "BLOB01", type: "blob" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE101" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM101" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE112" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM112" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSKEV" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "DTBG00", type: "date" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "DTEN00", type: "date" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "STMENT_EXT" }
    },
    {
      dataSection: "Z510",
      dataItem: { name: "USNAME" }
    },
    {
      dataSection: "Z5T1",
      dataItem: { name: "STATUX" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYOU00_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU01_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU02_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU03_EXT" }
    }
  ],
  ASW03OP4: [
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGOMS" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMDRW" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSLAP" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLEVCO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLGMCO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLPROB" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSCRT" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSKEV" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLDEVP" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLGL" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLCOPR" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLMBWI" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLSC" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLSCTK" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLQUES" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLOWPO" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLPFCR" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TXCOMM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNEM_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRFN_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRFN" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNSC_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRGL_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRGL" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXRWCM" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "FLTKEV" }
    },
    {
      dataSection: "Z5A2",
      dataItem: { name: "TYFLTK" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRTS" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRTS_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNTK_EXT" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "STMENT" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "DTEN00" }
    },
    {
      dataSection: "ZY63",
      dataItem: { name: "DTBG00" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "BLOB01", type: "blob" }
    },
    {
      dataSection: "Z5T1",
      dataItem: { name: "STATUX" }
    },
    {
      dataSection: "Z510",
      dataItem: { name: "USNAME" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM101" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE112" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM112" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYOU00_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU01_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU02_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU03_EXT" }
    }
  ],
  ASC03OE1: [
    {
      dataSection: "ZY3O",
      dataItem: { name: "IDCMPG" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLGOAL" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLSKEV" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLCOPR" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLTKEV" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLSCTK" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLQUES" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLPFCR" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLMBWI" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNSC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRGL_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRGL" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TYFLGL" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNTK" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNTK_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRTS" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRTS_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRTS" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TYFLSC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTLNEM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTPRFN" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXEMCM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXRWCM" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TXCOMM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTGRFN_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE101" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM101" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM102" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM103" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM104" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM105" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM106" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM107" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM108" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM109" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM110" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM111" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTE112" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "RTM112" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS101_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS102_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS103_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS104_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS105_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS106_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS107_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS108_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS109_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS110_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS111_EXT" }
    },
    {
      dataSection: "ZY3L",
      dataItem: { name: "IDS112_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLSLAP" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCONT_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCON3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDAREA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDARE3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOUN_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOU3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "TYOU00_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOMP_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDCOM3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOCA_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC2_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDLOC3_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU01_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU02_EXT" }
    },
    {
      dataSection: "ZY3W",
      dataItem: { name: "IDOU03_EXT" }
    }
  ],
  ASW03OP2: [
    {
      dataSection: "ZY3O",
      dataItem: { name: "IDCMPG" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLGOAL" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "FLPROB" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "TXEMCM" }
    },
    {
      dataSection: "ZY3N",
      dataItem: { name: "TXRWCM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLGOMS" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLGOCO" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLGMCO" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "FLSKRW" }
    },
    {
      dataSection: "ZY36",
      dataItem: { name: "GPSK00" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "BLOB01" }
    },
    {
      dataSection: "Z510",
      dataItem: { name: "USNAME" }
    },
    {
      dataSection: "Z5T1",
      dataItem: { name: "STATUX" }
    },
    {
      dataSection: "Z5T1",
      dataItem: { name: "TXCOMM" }
    }
  ],
  AIW400M2: [
    {
      dataSection: "ZB00",
      dataItem: { name: "IDCY00_EXT" }
    },
    {
      dataSection: "ZB00",
      dataItem: { name: "IDCY00" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "IDOU00" }
    },
    {
      dataSection: "ZB0A",
      dataItem: { name: "LBRECR" }
    }
  ],
  AIC060M2: [
    {
      dataSection: "ZY60",
      dataItem: { name: "DEC2CM" }
    },
    {
      dataSection: "ZY60",
      dataItem: { name: "DEC1CM" }
    },
    {
      dataSection: "ZY60",
      dataItem: { name: "DECSN2_EXT" }
    },
    {
      dataSection: "ZY60",
      dataItem: { name: "DECSN1_EXT" }
    },
    {
      dataSection: "ZY60",
      dataItem: { name: "DTTGPP" }
    },
    {
      dataSection: "ZY60",
      dataItem: { name: "DTBGPP" }
    },
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    }
  ],
  ASC640M2: [
    {
      dataSection: "ZE47",
      dataItem: { name: "DTEFTR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "IDCMCP_EXT" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTEFTR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTENPR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTEFPR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "AMBUP" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "AMBUPD" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT1" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT1D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT2" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT2D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT3" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT3D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT4" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT4D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "RTVALU" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "COUNT1" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "COUNT2" }
    }
  ],
  ASC640M1: [
    {
      dataSection: "ZY00",
      dataItem: { name: "MATCLE" }
    },
    {
      dataSection: "ZY3Y",
      dataItem: { name: "NMPRES" }
    },
    {
      dataSection: "ZY00",
      dataItem: { name: "SOCCLE" }
    },
    {
      dataSection: "ZY3B",
      dataItem: { name: "IDJB00_EXT" }
    },
    {
      dataSection: "ZY3B",
      dataItem: { name: "IDOU00_EXT" }
    },
    {
      dataSection: "ZY3B",
      dataItem: { name: "IDPS00" }
    },
    {
      dataSection: "ZYES",
      dataItem: { name: "DATENT" }
    },
    {
      dataSection: "ZYCA",
      dataItem: { name: "QUALIF_EXT" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "NMMANG" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "FLPATI_EXT" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "RTPDHR" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "AMANN" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "IDCUR" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "RTCOMP" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "AMSLY" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "RTRGPN" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "RTPACP" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "DTREVW" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "AMMIN" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "AMMAX" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "PERMIN" }
    },
    {
      dataSection: "ZE40",
      dataItem: { name: "PERMAX" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "DTREVW" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "STAEVL_EXT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "LIBNOT" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RVRANW" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTOBSC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "LIBOBJ" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "LIBTAC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "RTTSSC" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXEMCM" }
    },
    {
      dataSection: "ZY3O",
      dataItem: { name: "TXRWCM" }
    }
  ],
  ASD640MT: [
    {
      dataSection: "ZE47",
      dataItem: { name: "IDCMCP_EXT" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTEFTR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTENPR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "DTEFPR" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "AMBUP" }
    },
    {
      dataSection: "ZE47",
      dataItem: { name: "AMBUPD" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT1" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT1D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT2" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT2D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT3" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT3D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT4" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "AMNT4D" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "RTVALU" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "COUNT1" }
    },
    {
      dataSection: "ZE49",
      dataItem: { name: "COUNT2" }
    }
  ],
  ASC647M1: []
};

export const dataMapping: any = {
  DV46: {
    MBKF: {
      ASCSALE1: {
        dataSearch: dataSearch.ASCSALE1
      },
      ASW0ESE0: {
        dataSearch: dataSearch.ASW0ESE0,
        dataToTypeEmployee: {
          TXCOMM: "test comment"
        }
      },
      ASW0E5E0: {
        dataToTypeEmployee: {
          NOMPAR: "Torres",
          PREENF: "Fernando",
          NAIENF: "12/10/2020",
          TYPPAR: "Child",
          TXCOMM: "test comment"
        }
      },
      ASW0PPE0: {
        dataToTypeEmployee: {
          QUALIT: "Mr",
          NOMPPP: "Dani",
          PRENOM: "Danilo",
          NUMORD: "3",
          TYPPER: "Child",
          TELPHO: "24789563",
          NBPALT: "24559563",
          EMAILS: "danilo@gmail.com",
          ADREPP: "xx",
          COMPLE: "yy",
          ADZIPB: "20405",
          BURDPP: "Madrid",
          ADCNTR: "Spain",
          TXCOMM: "test comment"
        }
      },
      ASW00IE0: {
        dataToTypeEmployee: {
          LIBBEN: "Dani",
          CDPAYS: "Spain",
          DATDEB: "12/10/2020",
          DATFIN: "22/10/2020",
          LIBBAN: "BIAT",
          TXCOMM: "test comment"
        }
      },
      ASW018E0: {
        dataToTypeEmployee: {
          SITFAM: "Married",
          DATSIT: "16/11/2023",
          TXCOMM: "test comment"
        },
        dataSearch: dataSearch.ASW018E0
      },
      ASCSALE0: {
        dataSearch: dataSearch.ASCSALE0
      },
      ASW000E0: {
        dataToTypeEmployee: {
          BLOB01: "user-image.png",
          TXCOMM: "test comment"
        }
      },
      ASW0AGE0: {
        dataToTypeEmployee: {
          MOTIFA: "Sickness",
          DATDEB: `31/12/${year}`,
          DATFIN: `31/12/${year}`,
          TXCOMM: "test comment"
        },
        dataToTypeManager: {
          STATUX: "Approved",
          TXCOMM: "test comment"
        },
        dataSearch: dataSearch.ASW0AGE0
      },
      ASW0AGE1: {
        dataToTypeEmployee: {
          TXCOMM: "cancel abs test comment"
        },
        dataToTypeManager: {
          DATFIN: "31/12/2024",
          STATUX: "Approved",
          TXCOMM: "approved test comment"
        },
        dataSearch: dataSearch.ASW0AGE1
      },
      AIW400E1: {
        dataToTypeEmployee: {
          CDPAYS: "Tunisia",
          IDCY00: "AGIL USA",
          IDJB00: "Analyst",
          IDOU00: "Career",
          IDPS00: "Admin Assistant",
          IDSR00: "GP4U001",
          FLSREX: "Yes",
          TXCOMM: "test comment",
          DTFOST: "14/05/2030",
          DTFOEN: "14/05/2080",
          CLEMPL: "Consultant",
          AMSAL: "2500",
          DUPARA: { value: "MT", label: "Monthly" }
        },
        dataSearch: dataSearch.AIW400E1,
        applicationDataSearch: [
          {
            dataSection: "ZY2A",
            dataItem: { name: "LBSRSH" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSR00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "DTAPPL" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDPS00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDPS00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDJB00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDJB00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDOU00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDOU00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSOAP_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSOAP" }
          }
        ]
      },
      ASW00FE0: {
        dataSearch: dataSearch.ASW00FE0,
        dataToTypeEmployee: {
          TELFAX: "00997788",
          CDCODE: "11",
          TXCOMM: "test commment",
          CDPAYS: "France",
          TYPADD: "Summer address",
          DATDEB: "01/01/2029",
          DATFIN: "10/01/2029",
          NUMVFR: "123",
          BISTFR: "Bis",
          TELHOM: "912345678",
          COMMFR: "Paris",
          CPADFR: "15 August street",
          VOIEFR: "la Paix street",
          BURDFR: "Office",
          TELCEL: "673459886"
        }
      },
      ATC04AE0: {
        dataSearch: dataSearch.ATC04AE0
      },
      ARD0NJE0: {
        dataSearch: dataSearch.ARD0NJE0,
        dataToTypeEmployee: {
          DTACCN: "14/08/2024",
          DUACCN: "09:00",
          TIPO: "Work accident",
          CAUSA: "Harmful products",
          LUGAR: "Headquarters",
          CODEPI: "Back support",
          CODETR: "Pressure equipment",
          ACTVIC: "Driving a car",
          NATAC0: "Collision with another car",
          OBJVIC: "Car",
          FECBAJ: "14/08/2024",
          FECALT: "24/08/2024",
          LESION: "broken bones"
        }
      },
      ASW03DE0: {
        dataSearch: dataSearch.ASW03DE0,
        dataToTypeEmployee: {
          IDSK00: "Administration",
          LVPROF: "Basic",
          TXLVDE: "new skill",
          TXCOMM: "test comment"
        },
        dataToTypeManager: {
          STATUX: "AP"
        }
      },
      ASCSALE2: {
        dataSearch: dataSearch.ASCSALE2,
        dataToTypeEmployee: {
          IDSK00: "Administration",
          LVPROF: "Basic"
        }
      },
      ATW0RHE1: {
        dataSearch: dataSearch.ATW0RHE1,
        dataSearchModal: [
          {
            dataSection: "ZYRH",
            dataItem: { name: "NMPRES" }
          },
          {
            dataSection: "ZYRH",
            dataItem: { name: "DTRH00" }
          },
          {
            dataSection: "ZYRH",
            dataItem: { name: "DTEF00" }
          }
        ],
        dataToTypeEmployee: {
          DTEA00: "18/09/2030",
          DTLA00: "20/09/2030"
        }
      },
      ATC700E0: {
        dataToTypeEmployee: {
          IDTCLG: "test LOV",
          DOCR00: "Foreign Languages",
          TYAUDI: "General Management",
          LBCRLG: "English beginners",
          IDCR00: "ATS001",
          LBRQLG: "test long description",
          LBRQSH: "test",
          DTEA00: "14/11/2024",
          DTLA00: "24/11/2024",
          TRDAYS: "5",
          IDLOCA: "London",
          IDCL00: "NEW SESS",
          TXCOMM: "test comment",
          IDJBTG: "Analyst",
          IDSK00: "Agility",
          LVPROF: "Intermediate"
        },
        dataToTypeManager: {
          STRQOP: "Approved",
          TXCOMM: "test comment"
        },
        trainingCatalogDataSearch: [
          {
            dataSection: "ZT01",
            dataItem: { name: "LBCRLG" }
          },
          {
            dataSection: "ZT00",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZT1Q",
            dataItem: { name: "NBHOUR" }
          },
          {
            dataSection: "ZT1A",
            dataItem: { name: "FLELNG" }
          },
          {
            dataSection: "ZT1B",
            dataItem: { name: "IDSK00_EXT" }
          },
          {
            dataSection: "ZT1B",
            dataItem: { name: "LVPROF_EXT" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "NMPRES" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "MATCLE" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "IDCL00" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "IDCL00_EXT" }
          }
        ],
        classesDataSearch: [
          {
            dataSection: "ZU01",
            dataItem: { name: "LBCLSH" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCR00_EXT" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCL00" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "STCL00_EXT" }
          },
          {
            dataSection: "ZU2F",
            dataItem: { name: "IDLO00_EXT" }
          },
          {
            dataSection: "ZU2F",
            dataItem: { name: "IDROOM" }
          },
          {
            dataSection: "ZUAD",
            dataItem: { name: "DTRGCL" }
          },
          {
            dataSection: "ZUAD",
            dataItem: { name: "DTRGOP" }
          },
          {
            dataSection: "ZU2P",
            dataItem: { name: "NBSEAT" }
          },
          {
            dataSection: "ZU2B",
            dataItem: { name: "NBENRO" }
          },
          {
            dataSection: "ZU2B",
            dataItem: { name: "NBWLIS" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "BGTI00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DTENCL" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "ENTI00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "NBPE00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DUPE00_EXT" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DTEFCL" }
          }
        ],
        trainingProgramDataSearch: [
          {
            dataSection: "ZD00",
            dataItem: { name: "CDCODE" }
          },
          {
            dataSection: "ZDH7",
            dataItem: { name: "DOTP00_EXT" }
          },
          {
            dataSection: "ZD01",
            dataItem: { name: "LIBLON" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "NBOR00" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "IDCR00_EXT" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "FLIMPO_EXT" }
          }
        ]
      },
      AIW41VM1: {
        dataSearch: dataSearch.AIW41VM1
      },
      ASW03OP0: {
        dataToTypeManager: {
          DTTARG: "30/05/2024",
          RTWGHT: "90",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TXCOMM: "ASW03OP0 step 1",
          STATUX: "I agree with my objectives",
          CDCODE: "70140",
          LVPROF: "Not Specified",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          TXCOMM: "ASW03OP0 step 2"
        },
        dataSearch: dataSearch.ASW03OP0
      },
      ASW03OP3: {
        dataToTypeManager: {
          dossier: "52835",
          DTTARG: "30/06/2024",
          RTWGHT: "90",
          STCOMP: "50",
          RTMIDY: "80",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TXCOMM: "ASW03OP3 step 1",
          CDCODE: "70020",
          LVPROF: "Advanced",
          FLIMPO: "Required",
          RTMIDY2: "Intermediate"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with my mid-year review",
          TXCOMM: "ASW03OP3 step 2"
        },
        dataSearch: dataSearch.ASW03OP3
      },
      ASW03OP1: {
        dataToTypeManager: {
          RTMANA: "90",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TYTIFR: "Short Term",
          NBSCRK: "8",
          IDJB00: "Analyst",
          GPEM00: "Clerical",
          IDARIN: "Finance",
          RTLNSC: "Average",
          RTGRGL: "Meets expectations",
          RTPRGL: "90",
          RTGRFN: "Needs improvement",
          TXCOMM: "test comment",
          TXCRSH: "Criteria 1",
          TXCRLG: "Description of criteria 1",
          RTLNEM: "Excellent",
          DTBG00: "06/06/2024",
          DTEN00: "31/08/2024",
          STMENT: "active",
          RTPRFN: "90",
          VAMART: "Intermediate",
          FLIMPO: "Required",
          TXCOMM2: "ASW03OP1 step 1",
          TXCOMM3: "ASW03OP1 step 3"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with the evaluation",
          TXCOMM: "ASW03OP1 step 2"
        },
        dataSearch: dataSearch.ASW03OP1,
        dataSearchEmployee: [{ dataSection: "Z5T0", dataItem: { name: "TXCOMM" } }],
        dataSearchManager: [{ dataSection: "Z5T1", dataItem: { name: "TXCOMM" } }]
      },
      ASW03OP4: {
        dataToTypeManager: {
          DTTARG: "31/07/2024",
          RTWGHT: "90",
          TXOBSH: "Test objective",
          TXOBLG: "Description of the objective",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          RTMANA: "90",
          BLOB01: "blank.pdf",
          TYTIFR: "Short Term",
          NBSCRK: "8",
          IDJB00: "CEO",
          GPEM00: "Professional",
          IDARIN: "Management",
          TXCOMM: "test",
          TXCOMM3: "ASW03OP4 step 1",
          RTLNEM: "Excellent",
          RTPRFN: "90",
          RTGRFN: "Needs improvement",
          TXCRSH: "Criteria 1",
          TXCRLG: "description of the criteria",
          TXCOMM2: "Manager comment",
          TXCOMM4: "ASW03OP4 step 3",
          RTLNSC: "Excellent",
          RTGRGL: "Meets expectations",
          RTPRGL: "90",
          VAMART: "Intermediate",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with the evaluation",
          TXCOMM: "ASW03OP4 step 2"
        },
        dataSearch: dataSearch.ASW03OP4,
        dataSearchEmployee: [
          {
            dataSection: "Z5T0",
            dataItem: { name: "TXCOMM" }
          }
        ],
        dataSearchManager: [
          {
            dataSection: "Z5T1",
            dataItem: { name: "TXCOMM" }
          }
        ]
      },
      ASC03OE1: {
        dataToTypeManager: { dossier: "100031476" },
        dataSearch: dataSearch.ASC03OE1
      },
      ASW03OP2: {
        dataToTypeManager: {
          dossier: "100031476",
          campaign: "camp17",
          DTTARG: "30/05/2024",
          RTWGHT: "90",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          DATFIN: "22/04/2024",
          STATUX: "I agree with the objectives",
          TXCOMM: "test comment",
          CDCODE: "70140",
          LVPROF: "Not Specified",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          DTTARG: "30/06/2024",
          RTWGHT: "80",
          TXOBSH: "Objective 2",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          STATUX: "I agree with the objectives",
          CDCODE: "30220"
        },
        dataSearch: dataSearch.ASW03OP2,
        dataSearchTasks: [
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOAL" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "FLPROB" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "TXEMCM" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "TXRWCM" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOMS" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOCO" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGMCO" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLSKRW" }
          },
          {
            dataSection: "ZY36",
            dataItem: { name: "GPSK00" }
          },
          {
            dataSection: "ZY3O",
            dataItem: { name: "BLOB01" }
          },
          {
            dataSection: "Z510",
            dataItem: { name: "USNAME" }
          },
          {
            dataSection: "Z5T1",
            dataItem: { name: "STATUX" }
          },
          {
            dataSection: "Z5T1",
            dataItem: { name: "TXCOMM" }
          }
        ]
      },
      AIW400M2: {
        dataToTypeManager: {
          dossier: "6718021",
          IDPS00: "Front End Developer",
          LBSRLG: "long comment",
          LBSRSH: "test",
          DTFRST: "22/05/2094",
          DTFREN: "25/05/2094",
          NBRQFT: "15",
          NBRQIN: "10",
          CLEMPL: "Apprentice",
          CLMANA: "Branch Management",
          AMMGR: "1500",
          TXCOMM: "test comment",
          IDLG00: "Arabic",
          IDSCNM: "General",
          TXSECT: "test description",
          IDESTA: "GP4You Location",
          IDJB00: "Analyst",
          TYVACY: "New position",
          FLSP02: "Yes"
        },
        dataSearch: dataSearch.AIW400M2,
        simulationDataSearch: [
          {
            dataSection: "ZB00",
            dataItem: { name: "IDCY00_EXT" }
          },
          {
            dataSection: "ZB00",
            dataItem: { name: "IDCY00" }
          },
          {
            dataSection: "ZB0A",
            dataItem: { name: "IDOU00" }
          },
          {
            dataSection: "ZB0A",
            dataItem: { name: "LBRECR" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDESTA" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDESTA_EXT" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "IDLG00" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "IDSCNM" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "TXSECT" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "FLPOST" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "AMMIN" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "AMMAX" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "CURCY" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDDU00_EXT" }
          }
        ]
      },
      AIC060M2: {
        dataToTypeManager: {
          dossier: "100031476"
        },
        dataSearch: dataSearch.AIC060M2,
        dataSearchModal: [
          {
            dataSection: "ZY4N",
            dataItem: { name: "TXQUES" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "FLRWYN" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "FLRWRN" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "TXRWCM" }
          }
        ]
      }
    }
  },
  MT22: {
    GPUMCO1: {
      ASCSALE1: {
        dataSearch: dataSearch.ASCSALE1
      },
      ASW0ESE0: {
        dataSearch: dataSearch.ASW0ESE0,
        dataToTypeEmployee: {
          TXCOMM: "test comment"
        }
      },
      ASW0E5E0: {
        dataToTypeEmployee: {
          NOMPAR: "Torres",
          PREENF: "Fernando",
          NAIENF: "12/10/2020",
          TYPPAR: "Child",
          TXCOMM: "test comment"
        }
      },
      ASW00IE0: {
        dataToTypeEmployee: {
          LIBBEN: "Dani",
          CDPAYS: "Spain",
          DATDEB: "12/10/2020",
          DATFIN: "22/10/2020",
          LIBBAN: "BIAT",
          TXCOMM: "test comment"
        }
      },
      ASW018E0: {
        dataToTypeEmployee: {
          SITFAM: "Married",
          DATSIT: "16/11/2023",
          TXCOMM: "test comment"
        },
        dataSearch: dataSearch.ASW018E0
      },
      ASCSALE0: {
        dataSearch: dataSearch.ASCSALE0
      },
      ARD0NJE0: {
        dataSearch: dataSearch.ARD0NJE0,
        dataToTypeEmployee: {
          DTACCN: "14/08/2024",
          DUACCN: "09:00",
          TIPO: "Work accident",
          CAUSA: "Harmful products",
          LUGAR: "Headquarters",
          CODEPI: "Back support",
          CODETR: "Pressure equipment",
          ACTVIC: "Driving a car",
          NATAC0: "Collision with another car",
          OBJVIC: "Car",
          FECBAJ: "14/08/2024",
          FECALT: "24/08/2024",
          LESION: "broken bones"
        }
      },
      ASW03DE0: {
        dataSearch: dataSearch.ASW03DE0,
        dataToTypeEmployee: {
          IDSK00: "Administration",
          LVPROF: "Basic",
          TXLVDE: "new skill",
          TXCOMM: "test comment"
        },
        dataToTypeManager: {
          STATUX: "AP"
        }
      },
      ASCSALE2: {
        dataSearch: dataSearch.ASCSALE2,
        dataToTypeEmployee: {
          IDSK00: "Administration",
          LVPROF: "Basic"
        }
      },

      ATC700E0: {
        dataToTypeEmployee: {
          IDTCLG: "test LOV",
          DOCR00: "Foreign Languages",
          TYAUDI: "General Management",
          LBCRLG: "English beginners",
          IDCR00: "ATS001",
          LBRQLG: "test long description",
          LBRQSH: "test",
          DTEA00: "14/11/2024",
          DTLA00: "24/11/2024",
          TRDAYS: "5",
          IDLOCA: "London",
          IDCL00: "TEST2",
          TXCOMM: "test comment",
          IDJBTG: "Analyst",
          IDSK00: "Agility",
          LVPROF: "Intermediate"
        },
        dataToTypeManager: {
          STRQOP: "Approved",
          TXCOMM: "test comment"
        },
        trainingCatalogDataSearch: [
          {
            dataSection: "ZT01",
            dataItem: { name: "LBCRLG" }
          },
          {
            dataSection: "ZT00",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZT1Q",
            dataItem: { name: "NBHOUR" }
          },
          {
            dataSection: "ZT1A",
            dataItem: { name: "FLELNG" }
          },
          {
            dataSection: "ZT1B",
            dataItem: { name: "IDSK00_EXT" }
          },
          {
            dataSection: "ZT1B",
            dataItem: { name: "LVPROF_EXT" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "NMPRES" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "MATCLE" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "IDCL00" }
          },
          {
            dataSection: "ZV39",
            dataItem: { name: "IDCL00_EXT" }
          }
        ],
        classesDataSearch: [
          {
            dataSection: "ZU01",
            dataItem: { name: "LBCLSH" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCR00_EXT" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCL00" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZU00",
            dataItem: { name: "STCL00_EXT" }
          },
          {
            dataSection: "ZU2F",
            dataItem: { name: "IDLO00_EXT" }
          },
          {
            dataSection: "ZU2F",
            dataItem: { name: "IDROOM" }
          },
          {
            dataSection: "ZUAD",
            dataItem: { name: "DTRGCL" }
          },
          {
            dataSection: "ZUAD",
            dataItem: { name: "DTRGOP" }
          },
          {
            dataSection: "ZU2P",
            dataItem: { name: "NBSEAT" }
          },
          {
            dataSection: "ZU2B",
            dataItem: { name: "NBENRO" }
          },
          {
            dataSection: "ZU2B",
            dataItem: { name: "NBWLIS" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "BGTI00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DTENCL" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "ENTI00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "NBPE00" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DUPE00_EXT" }
          },
          {
            dataSection: "ZU2A",
            dataItem: { name: "DTEFCL" }
          }
        ],
        trainingProgramDataSearch: [
          {
            dataSection: "ZD00",
            dataItem: { name: "CDCODE" }
          },
          {
            dataSection: "ZDH7",
            dataItem: { name: "DOTP00_EXT" }
          },
          {
            dataSection: "ZD01",
            dataItem: { name: "LIBLON" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "NBOR00" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "IDCR00" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "IDCR00_EXT" }
          },
          {
            dataSection: "ZDHB",
            dataItem: { name: "FLIMPO_EXT" }
          }
        ]
      },
      AIW41VM1: {
        dataSearch: dataSearch.AIW41VM1
      },
      ASW03OP0: {
        dataToTypeManager: {
          DTTARG: "30/05/2024",
          RTWGHT: "90",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TXCOMM: "ASW03OP0 step 1",
          STATUX: "I agree with my objectives",
          CDCODE: "70140",
          LVPROF: "Not Specified",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          TXCOMM: "ASW03OP0 step 2"
        },
        dataSearch: dataSearch.ASW03OP0
      },
      ASW03OP3: {
        dataToTypeManager: {
          dossier: "52835",
          DTTARG: "30/06/2024",
          RTWGHT: "90",
          STCOMP: "50",
          RTMIDY: "80",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TXCOMM: "ASW03OP3 step 1",
          CDCODE: "70020",
          LVPROF: "Advanced",
          FLIMPO: "Required",
          RTMIDY2: "Intermediate"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with my mid-year review",
          TXCOMM: "ASW03OP3 step 2"
        },
        dataSearch: dataSearch.ASW03OP3
      },
      ASW03OP1: {
        dataToTypeManager: {
          RTMANA: "90",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          TYTIFR: "Short Term",
          NBSCRK: "8",
          IDJB00: "Analyst",
          GPEM00: "Clerical",
          IDARIN: "Finance",
          RTLNSC: "Average",
          RTGRGL: "Meets expectations",
          RTPRGL: "90",
          RTGRFN: "Needs improvement",
          TXCOMM: "test comment",
          TXCRSH: "Criteria 1",
          TXCRLG: "Description of criteria 1",
          RTLNEM: "Excellent",
          DTBG00: "06/06/2024",
          DTEN00: "31/08/2024",
          STMENT: "active",
          RTPRFN: "90",
          VAMART: "Intermediate",
          FLIMPO: "Required",
          TXCOMM2: "ASW03OP1 step 1",
          TXCOMM3: "ASW03OP1 step 3"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with the evaluation",
          TXCOMM: "ASW03OP1 step 2"
        },
        dataSearch: dataSearch.ASW03OP1,
        dataSearchEmployee: [{ dataSection: "Z5T0", dataItem: { name: "TXCOMM" } }],
        dataSearchManager: [{ dataSection: "Z5T1", dataItem: { name: "TXCOMM" } }]
      },
      ASW03OP4: {
        dataToTypeManager: {
          DTTARG: "31/07/2024",
          RTWGHT: "90",
          TXOBSH: "Test objective",
          TXOBLG: "Description of the objective",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          RTMANA: "90",
          BLOB01: "blank.pdf",
          TYTIFR: "Short Term",
          NBSCRK: "8",
          IDJB00: "CEO",
          GPEM00: "Professional",
          IDARIN: "Management",
          TXCOMM: "test",
          TXCOMM3: "ASW03OP4 step 1",
          RTLNEM: "Excellent",
          RTPRFN: "90",
          RTGRFN: "Needs improvement",
          TXCRSH: "Criteria 1",
          TXCRLG: "description of the criteria",
          TXCOMM2: "Manager comment",
          TXCOMM4: "ASW03OP4 step 3",
          RTLNSC: "Excellent",
          RTGRGL: "Meets expectations",
          RTPRGL: "90",
          VAMART: "Intermediate",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          STATUX: "I agree with the evaluation",
          TXCOMM: "ASW03OP4 step 2"
        },
        dataSearch: dataSearch.ASW03OP4,
        dataSearchEmployee: [
          {
            dataSection: "Z5T0",
            dataItem: { name: "TXCOMM" }
          }
        ],
        dataSearchManager: [
          {
            dataSection: "Z5T1",
            dataItem: { name: "TXCOMM" }
          }
        ]
      },
      ASW03OP2: {
        dataToTypeManager: {
          dossier: "121465",
          campaign: "GP4UTEST15",
          DTTARG: "30/05/2024",
          RTWGHT: "90",
          TXOBSH: "Objective 1",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          TXRWCM: "Manager comments",
          BLOB01: "blank.pdf",
          DATFIN: "22/04/2024",
          STATUX: "I agree with the objectives",
          TXCOMM: "test comment",
          CDCODE: "70140",
          LVPROF: "Not Specified",
          FLIMPO: "Required"
        },
        dataToTypeEmployee: {
          DTTARG: "30/06/2024",
          RTWGHT: "80",
          TXOBSH: "Objective 2",
          TXOBLG: "Description",
          TXMESR: "Measures to be taken",
          STATUX: "I agree with the objectives",
          CDCODE: "30220"
        },
        dataSearch: dataSearch.ASW03OP2,
        dataSearchTasks: [
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOAL" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "FLPROB" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "TXEMCM" }
          },
          {
            dataSection: "ZY3N",
            dataItem: { name: "TXRWCM" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOMS" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGOCO" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLGMCO" }
          },
          {
            dataSection: "Z5A2",
            dataItem: { name: "FLSKRW" }
          },
          {
            dataSection: "ZY36",
            dataItem: { name: "GPSK00" }
          },
          {
            dataSection: "ZY3O",
            dataItem: { name: "BLOB01" }
          },
          {
            dataSection: "Z510",
            dataItem: { name: "USNAME" }
          },
          {
            dataSection: "Z5T1",
            dataItem: { name: "STATUX" }
          },
          {
            dataSection: "Z5T1",
            dataItem: { name: "TXCOMM" }
          }
        ]
      },

      ATW0RHE1: {
        dataSearch: dataSearch.ATW0RHE1,
        dataSearchModal: [
          {
            dataSection: "ZYRH",
            dataItem: { name: "NMPRES" }
          },
          {
            dataSection: "ZYRH",
            dataItem: { name: "DTRH00" }
          },
          {
            dataSection: "ZYRH",
            dataItem: { name: "DTEF00" }
          }
        ],
        dataToTypeEmployee: {
          DTEA00: "18/09/2030",
          DTLA00: "20/09/2030"
        }
      },
      ASW0PPE0: {
        dataToTypeEmployee: {
          QUALIT: "Mr",
          NOMPPP: "Dani",
          PRENOM: "Danilo",
          NUMORD: "4",
          TYPPER: "Child",
          TELPHO: "24789563",
          NBPALT: "24559563",
          EMAILS: "danilo@gmail.com",
          ADREPP: "xx",
          COMPLE: "yy",
          ADZIPB: "20405",
          BURDPP: "Madrid",
          ADCNTR: "Spain",
          TXCOMM: "test comment"
        }
      },
      ASW0AGE0: {
        dataToTypeEmployee: {
          MOTIFA: "Sickness",
          DATDEB: `31/12/${year}`,
          DATFIN: `31/12/${year}`,
          TXCOMM: "test comment"
        },
        dataToTypeManager: {
          STATUX: "Approved",
          TXCOMM: "test comment"
        },
        dataSearch: dataSearch.ASW0AGE0
      },
      ASW0AGE1: {
        dataToTypeEmployee: {
          TXCOMM: "cancel abs test comment"
        },
        dataToTypeManager: {
          DATFIN: "31/12/2024",
          STATUX: "Approved",
          TXCOMM: "approved test comment"
        },
        dataSearch: dataSearch.ASW0AGE1
      },
      ASW00FE0: {
        dataSearch: dataSearch.ASW00FE0,
        dataToTypeEmployee: {
          TELFAX: "00997788",
          CDCODE: "11",
          TXCOMM: "test commment",
          CDPAYS: "France",
          TYPADD: "Summer address",
          DATDEB: "01/01/2029",
          DATFIN: "10/01/2029",
          NUMVFR: "123",
          BISTFR: "Bis",
          TELHOM: "912345678",
          COMMFR: "Paris",
          CPADFR: "15 August street",
          VOIEFR: "la Paix street",
          BURDFR: "Office",
          TELCEL: "673459886"
        }
      },
      ASC03OE1: {
        dataToTypeManager: { dossier: "121465" },
        dataSearch: dataSearch.ASC03OE1
      },
      AIW400E1: {
        dataToTypeEmployee: {
          CDPAYS: "Tunisia",
          IDCY00: "GP4You Company",
          IDJB00: "Analyst",
          IDOU00: "Career",
          IDPS00: "Admin Assistant",
          IDSR00: "GP4U001",
          FLSREX: "Yes",
          TXCOMM: "test comment",
          DTFOST: "14/05/2030",
          DTFOEN: "14/05/2080",
          CLEMPL: "Consultant",
          AMSAL: "2500",
          DUPARA: { value: "MT", label: "Monthly" }
        },
        dataSearch: dataSearch.AIW400E1,
        applicationDataSearch: [
          {
            dataSection: "ZY2A",
            dataItem: { name: "LBSRSH" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSR00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "DTAPPL" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDPS00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDPS00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDJB00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDJB00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDOU00_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDOU00" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSOAP_EXT" }
          },
          {
            dataSection: "ZY2A",
            dataItem: { name: "IDSOAP" }
          }
        ]
      },
      ASW000E0: {
        dataToTypeEmployee: {
          BLOB01: "user-image.png",
          TXCOMM: "test comment"
        }
      },
      ATC04AE0: {
        dataSearch: dataSearch.ATC04AE0
      },
      AIC060M2: {
        dataToTypeManager: {
          dossier: "121466"
        },
        dataSearch: dataSearch.AIC060M2,
        dataSearchModal: [
          {
            dataSection: "ZY4N",
            dataItem: { name: "TXQUES" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "FLRWYN" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "FLRWRN" }
          },
          {
            dataSection: "ZY4N",
            dataItem: { name: "TXRWCM" }
          }
        ]
      },
      AIW400M2: {
        dataToTypeManager: {
          dossier: "6718021",
          IDPS00: "Front End Developer",
          LBSRLG: "long comment",
          LBSRSH: "test",
          DTFRST: "22/05/2094",
          DTFREN: "25/05/2094",
          NBRQFT: "15",
          NBRQIN: "10",
          CLEMPL: "Apprentice",
          CLMANA: "Branch Management",
          AMMGR: "1500",
          TXCOMM: "test comment",
          IDLG00: "Arabic",
          IDSCNM: "General",
          TXSECT: "test description",
          IDESTA: "GP4You Location",
          IDJB00: "Analyst",
          TYVACY: "New position",
          FLSP02: "Yes"
        },
        dataSearch: dataSearch.AIW400M2,
        simulationDataSearch: [
          {
            dataSection: "ZB00",
            dataItem: { name: "IDCY00_EXT" }
          },
          {
            dataSection: "ZB00",
            dataItem: { name: "IDCY00" }
          },
          {
            dataSection: "ZB0A",
            dataItem: { name: "IDOU00" }
          },
          {
            dataSection: "ZB0A",
            dataItem: { name: "LBRECR" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDESTA" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDESTA_EXT" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "IDLG00" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "IDSCNM" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "TXSECT" }
          },
          {
            dataSection: "ZB1E",
            dataItem: { name: "FLPOST" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "AMMIN" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "AMMAX" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "CURCY" }
          },
          {
            dataSection: "ZB0E",
            dataItem: { name: "IDDU00_EXT" }
          }
        ]
      },
      ASC640M2: {
        dataSearch: dataSearch.ASC640M2
      },
      ASC640M1: {
        dataSearch: dataSearch.ASC640M1
      },
      ASD640MT: {
        dataSearch: dataSearch.ASD640MT
      },
      ASC647M1: {
        dataSearch: dataSearch.ASC647M1
      }
    }
  }
};
