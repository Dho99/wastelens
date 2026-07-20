export type EntityUser = {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string;
};

export type EntityDinas = {
  id: string;
  nama_dinas: string;
  kontak: string;
  email: string;
  status: string;
};

export type EntityKopdes = {
  id: string;
  nama: string;
  alamat: string;
  email: string;
  status: string;
};

export type DinasForm = {
  nama_dinas: string;
  kontak: string;
  email: string;
};

export type KopdesForm = {
  nama: string;
  alamat: string;
  email: string;
};
