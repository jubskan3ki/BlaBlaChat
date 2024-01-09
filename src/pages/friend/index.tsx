import { useEffect, useState } from 'react';
import Modal from '../../components/feedback/modal';
import ApiUser from '../../api/user/user.api';
import UserList from '../../components/other/userList';
import { ProfileCardProps } from '../../interface/components/other/profileCard.interface';
import '../../assets/style/pages/friend.css';
import Titre from '../../components/common/titre';

function Channel() {
    const [users, setUsers] = useState<ProfileCardProps[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<ProfileCardProps[]>([]);
    const [filter, setFilter] = useState('');

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
                user.name?.toLowerCase().includes(filter.toLowerCase()) ||
                user.username?.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [filter, users]);

    const displayedUsers = filteredUsers.slice(0, 15);

    return (
        <Modal>
            <div className="friend-content">
                <Titre title="Crée un groupe" balise="h1" hasBorderBottom />
                <input
                    type="text"
                    placeholder="Rechercher des utilisateurs..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <UserList users={displayedUsers} />
            </div>
        </Modal>
    );
}

export default Channel;
