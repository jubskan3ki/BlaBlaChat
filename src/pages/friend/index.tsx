import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Modal from '../../components/feedback/modal';
import Alert from '../../components/feedback/alert';
import ApiUser from '../../api/user/user.api';
import ApiContact from '../../api/contact/contact.api';
import UserList from '../../components/other/userList';
import { ProfileCardProps } from '../../interface/components/other/profileCard.interface';
import '../../assets/style/pages/friend.css';
import Titre from '../../components/common/titre';

function Channel() {
    const [users, setUsers] = useState<ProfileCardProps[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<ProfileCardProps[]>([]);
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState({
        type: '',
        message: '',
        key: Date.now(),
    });
    const currentUser = useSelector((state: RootState) => state.user.value);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await ApiUser.getUsers();
            if (!response.error && response.data) {
                setUsers(response.data);
                setFilteredUsers(response.data);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.email?.toLowerCase().includes(filter.toLowerCase()) ||
                user.username?.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [filter, users]);

    const handleAddFollower = async (userId: number) => {
        const followerData = {
            user: currentUser ? currentUser.id : 0,
            follower: userId,
        };
        console.log(followerData);
        const response = await ApiContact.createFollower(followerData);
        if (response.error) {
            setNotification({
                type: 'error',
                message: "Échec de l'ajout du follower",
                key: Date.now(),
            });
        } else {
            setNotification({
                type: 'success',
                message: 'Follower ajouté avec succès',
                key: Date.now(),
            });
        }
    };

    const handleDeleteFollower = async (userId: number) => {
        const response = await ApiContact.deleteFollower(userId);
        if (response.error) {
            setNotification({
                type: 'error',
                message: 'Échec de la suppression du follower',
                key: Date.now(),
            });
        } else {
            setNotification({
                type: 'success',
                message: 'Follower supprimé avec succès',
                key: Date.now(),
            });
        }
    };

    const displayedUsers = filteredUsers.slice(0, 15);

    return (
        <Modal>
            {notification.message && (
                <Alert
                    key={notification.key.toString()}
                    type={notification.type}
                    message={notification.message}
                />
            )}
            <div className="friend-content">
                <Titre title="Gerée vos Follow" balise="h1" hasBorderBottom />
                <input
                    type="text"
                    placeholder="Rechercher des utilisateurs..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <UserList
                    users={displayedUsers}
                    onAddFollower={handleAddFollower}
                    deleteFollower={handleDeleteFollower}
                />
            </div>
        </Modal>
    );
}

export default Channel;
