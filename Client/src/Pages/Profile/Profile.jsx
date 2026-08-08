import React, { useEffect, useState } from 'react'
import Input from '../../Components/Input/Input';
import TextArea from '../../Components/Textarea/TextArea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import Button from '../../Components/Button/Button';
import { apiClient } from '../../axios/axios';
import { Camera, Upload, Sparkles, UserCircle } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [ing, setIng] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const navigate = useNavigate()

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set('name', name);
      if (avatar) formData.set('avatar', avatar);

      const response = await apiClient.put(`profile`, formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) {
        toast.success(response.data.message || 'Profil mis à jour avec succès !');
        setIsLoading(false);
      } else {
        toast.error("Échec de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      toast.error("une erreur de source incconnue s'est produite veuiller réessayer plus tard");
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      setIsLoading(true);
      try {
        const response = await apiClient.delete(`profile`);
        if (response.data.success) {
          toast.success(response.data.message || 'Compte supprimé avec succès.');
          navigate('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du compte", error);
        toast.error("Échec de la suppression du compte.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBackgroundColor = () => {
    const colors = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#e53e3e', '#9f7aea'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setAvatarPreview('')
  }, [avatar])

  useEffect(() => {
    const displayUserProfil = async () => {
      try {
        const response = await apiClient.get('profile');
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    displayUserProfil();
  }, []);

  const currentAvatarUrl = profile[0]?.avatar
    ? `${import.meta.env.VITE_ASSETS_URL || ''}/avatars/${profile[0].avatar.split('\\').pop()}`
    : '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mon profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gérez vos informations publiques et votre photo.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Carte profil */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          {profile && profile.map((user, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="flex h-24 w-24 rounded-full bg-linear-to-br from-primary to-accent p-[3px]">
                {user.avatar ? (
                  <img
                    src={currentAvatarUrl}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full text-2xl font-semibold text-white"
                    style={{ backgroundColor: getBackgroundColor() }}
                  >
                    <span>{user.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{user.name}</h2>
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-accent" />
                Membre Foruma
              </span>
            </div>
          ))}
          {!profile.length && (
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <UserCircle className="h-16 w-16" />
              <p className="mt-2 text-sm">Chargement du profil…</p>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleEditProfile} className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">Modifier le profil</h2>
            <p className="mt-1 text-sm text-muted-foreground">Mettez à jour vos informations publiques.</p>

            {/* Zone upload avatar moderne */}
            <div className="mt-6 flex flex-col items-center gap-5 rounded-xl border border-dashed border-input bg-muted/20 p-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary/15 to-accent/15 text-primary">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Aperçu" className="h-full w-full object-cover" />
                ) : currentAvatarUrl ? (
                  <img src={currentAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-7 w-7" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">Photo de profil</p>
                <p className="text-xs text-muted-foreground">PNG ou JPG, de préférence carré.</p>
                <label
                  htmlFor="fileUpload"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {avatar ? avatar.name : 'Choisir un fichier'}
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input
                label={'Nom'}
                type={'text'}
                reference={'name'}
                placeholder={'Saisir le nom ici...'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired={false}
              />
              <Input
                label={"Domaine d'ingénierie"}
                type={'text'}
                reference={'ing'}
                placeholder={"Votre domaine d'ingénierie ici..."}
                value={ing}
                onChange={(e) => setIng(e.target.value)}
                isRequired={false}
              />
            </div>

            <div className="mt-5">
              <TextArea
                label={'Bio'}
                reference={'bio'}
                placeholder={"Saisir une bio ici..."}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                text={isLoading ? 'En cours...' : 'Valider'}
              />
              <Button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                text={isLoading ? 'En cours...' : 'Supprimer le compte'}
                className="bg-transparent! text-destructive! border! border-destructive/30! hover:bg-destructive/10!"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}